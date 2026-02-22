// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/// @notice Lightweight EVM entrypoint that captures user order intents and
/// emits deterministic events for the VEIL relayer.
contract VeilOrderIntentGateway {
    uint8 public constant SIDE_BUY = 0;
    uint8 public constant SIDE_SELL = 1;
    uint8 public constant OUTCOME_YES = 0;
    uint8 public constant OUTCOME_NO = 1;
    uint8 public constant MARKET_TYPE_VEIL_NATIVE = 0;
    uint8 public constant MARKET_TYPE_POLYGON_NATIVE = 1;
    uint16 public constant POLYGON_ROUTING_FEE_BPS = 3; // 0.03%

    enum IntentState {
        NONE,
        SUBMITTED,
        EXECUTED,
        CANCELLED
    }

    struct Intent {
        address trader;
        bytes32 marketKey;
        uint64 amountUsdE6;
        uint16 routingFeeBps;
        uint8 side;
        uint8 outcome;
        uint8 marketType;
        uint64 nonce;
        IntentState state;
    }

    error Unauthorized();
    error InvalidAddress();
    error InvalidSide(uint8 side);
    error InvalidOutcome(uint8 outcome);
    error InvalidMarketType(uint8 marketType);
    error InvalidAmount();
    error InvalidRoutingFee(uint16 provided, uint16 requiredFloor, uint8 marketType);
    error IntentAlreadyExists(bytes32 intentId);
    error IntentNotFound(bytes32 intentId);
    error IntentNotSubmitted(bytes32 intentId);
    error IntentNotOwned(bytes32 intentId, address expectedOwner, address sender);

    event OwnerTransferred(address indexed previousOwner, address indexed newOwner);
    event RelayExecutorSet(address indexed previousRelay, address indexed newRelay);
    event IntentSubmitted(
        bytes32 indexed intentId,
        address indexed trader,
        bytes32 indexed marketKey,
        uint8 side,
        uint8 outcome,
        uint64 amountUsdE6,
        uint8 marketType,
        uint16 routingFeeBps,
        uint64 nonce
    );
    event IntentExecuted(bytes32 indexed intentId, bytes32 indexed veilTxHash, address indexed executor);
    event IntentCancelled(bytes32 indexed intentId, address indexed trader);

    address public owner;
    address public relayExecutor;

    mapping(address => uint64) public nonces;
    mapping(bytes32 => Intent) private intents;

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    modifier onlyRelay() {
        if (msg.sender != relayExecutor) {
            revert Unauthorized();
        }
        _;
    }

    constructor(address initialOwner, address initialRelayExecutor) {
        owner = initialOwner == address(0) ? msg.sender : initialOwner;
        relayExecutor = initialRelayExecutor;
        emit OwnerTransferred(address(0), owner);
        emit RelayExecutorSet(address(0), initialRelayExecutor);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) {
            revert InvalidAddress();
        }
        emit OwnerTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setRelayExecutor(address newRelayExecutor) external onlyOwner {
        emit RelayExecutorSet(relayExecutor, newRelayExecutor);
        relayExecutor = newRelayExecutor;
    }

    function submitIntent(
        bytes32 marketKey,
        uint8 side,
        uint8 outcome,
        uint64 amountUsdE6,
        uint8 marketType,
        uint16 routingFeeBps
    ) external returns (bytes32 intentId) {
        if (side > SIDE_SELL) {
            revert InvalidSide(side);
        }
        if (outcome > OUTCOME_NO) {
            revert InvalidOutcome(outcome);
        }
        if (marketType > MARKET_TYPE_POLYGON_NATIVE) {
            revert InvalidMarketType(marketType);
        }
        if (amountUsdE6 == 0) {
            revert InvalidAmount();
        }

        uint16 normalizedRoutingFeeBps = normalizeRoutingFee(marketType, routingFeeBps);
        uint64 nonce = nonces[msg.sender];
        nonces[msg.sender] = nonce + 1;

        intentId = keccak256(
            abi.encode(
                block.chainid,
                address(this),
                msg.sender,
                marketKey,
                side,
                outcome,
                amountUsdE6,
                marketType,
                normalizedRoutingFeeBps,
                nonce
            )
        );

        if (intents[intentId].state != IntentState.NONE) {
            revert IntentAlreadyExists(intentId);
        }

        intents[intentId] = Intent({
            trader: msg.sender,
            marketKey: marketKey,
            amountUsdE6: amountUsdE6,
            routingFeeBps: normalizedRoutingFeeBps,
            side: side,
            outcome: outcome,
            marketType: marketType,
            nonce: nonce,
            state: IntentState.SUBMITTED
        });

        emit IntentSubmitted(
            intentId,
            msg.sender,
            marketKey,
            side,
            outcome,
            amountUsdE6,
            marketType,
            normalizedRoutingFeeBps,
            nonce
        );
    }

    function markIntentExecuted(bytes32 intentId, bytes32 veilTxHash) external onlyRelay {
        Intent storage intent = intents[intentId];
        if (intent.state == IntentState.NONE) {
            revert IntentNotFound(intentId);
        }
        if (intent.state != IntentState.SUBMITTED) {
            revert IntentNotSubmitted(intentId);
        }
        intent.state = IntentState.EXECUTED;
        emit IntentExecuted(intentId, veilTxHash, msg.sender);
    }

    function cancelIntent(bytes32 intentId) external {
        Intent storage intent = intents[intentId];
        if (intent.state == IntentState.NONE) {
            revert IntentNotFound(intentId);
        }
        if (intent.trader != msg.sender) {
            revert IntentNotOwned(intentId, intent.trader, msg.sender);
        }
        if (intent.state != IntentState.SUBMITTED) {
            revert IntentNotSubmitted(intentId);
        }
        intent.state = IntentState.CANCELLED;
        emit IntentCancelled(intentId, msg.sender);
    }

    function getIntent(bytes32 intentId) external view returns (Intent memory) {
        Intent memory intent = intents[intentId];
        if (intent.state == IntentState.NONE) {
            revert IntentNotFound(intentId);
        }
        return intent;
    }

    function normalizeRoutingFee(uint8 marketType, uint16 requestedFeeBps) public pure returns (uint16) {
        if (marketType == MARKET_TYPE_POLYGON_NATIVE) {
            if (requestedFeeBps == 0) {
                return POLYGON_ROUTING_FEE_BPS;
            }
            if (requestedFeeBps < POLYGON_ROUTING_FEE_BPS) {
                revert InvalidRoutingFee(requestedFeeBps, POLYGON_ROUTING_FEE_BPS, marketType);
            }
            return requestedFeeBps;
        }

        if (requestedFeeBps != 0) {
            revert InvalidRoutingFee(requestedFeeBps, 0, marketType);
        }
        return 0;
    }
}
