// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/// @notice EVM-side intent gateway for VEIL UniV2 liquidity actions.
/// Relayers consume submitted intents and execute them through the VEIL router.
contract VeilLiquidityIntentGateway {
    uint8 public constant OP_CREATE_POOL = 0;
    uint8 public constant OP_ADD_LIQUIDITY = 1;
    uint8 public constant OP_REMOVE_LIQUIDITY = 2;
    uint8 public constant OP_SWAP_EXACT_IN = 3;

    uint8 public constant ASSET_VEIL = 0;
    uint8 public constant ASSET_VAI = 1;

    uint16 public constant MIN_POOL_FEE_BIPS = 1;
    uint16 public constant MAX_POOL_FEE_BIPS = 1000;

    enum IntentState {
        NONE,
        SUBMITTED,
        EXECUTED,
        CANCELLED
    }

    struct LiquidityIntent {
        address trader;
        uint8 operation;
        uint8 asset0;
        uint8 asset1;
        uint16 feeBips;
        uint64 amount0;
        uint64 amount1;
        uint64 minLP;
        uint64 lpAmount;
        uint64 minAmount0;
        uint64 minAmount1;
        uint64 amountIn;
        uint64 minAmountOut;
        uint64 nonce;
        IntentState state;
    }

    error Unauthorized();
    error InvalidAddress();
    error InvalidOperation(uint8 operation);
    error InvalidAsset(uint8 asset);
    error InvalidAssetPair(uint8 asset0, uint8 asset1);
    error InvalidAmount();
    error InvalidFeeBips(uint16 feeBips);
    error IntentAlreadyExists(bytes32 intentId);
    error IntentNotFound(bytes32 intentId);
    error IntentNotSubmitted(bytes32 intentId);
    error IntentNotOwned(bytes32 intentId, address expectedOwner, address sender);

    event OwnerTransferred(address indexed previousOwner, address indexed newOwner);
    event RelayExecutorSet(address indexed previousRelay, address indexed newRelay);

    event LiquidityIntentSubmitted(
        bytes32 indexed intentId,
        address indexed trader,
        uint8 indexed operation,
        uint8 asset0,
        uint8 asset1,
        uint16 feeBips,
        uint64 amount0,
        uint64 amount1,
        uint64 minLP,
        uint64 lpAmount,
        uint64 minAmount0,
        uint64 minAmount1,
        uint64 amountIn,
        uint64 minAmountOut,
        uint64 nonce
    );
    event LiquidityIntentExecuted(bytes32 indexed intentId, bytes32 indexed veilTxHash, address indexed executor);
    event LiquidityIntentCancelled(bytes32 indexed intentId, address indexed trader);

    address public owner;
    address public relayExecutor;

    mapping(address => uint64) public nonces;
    mapping(bytes32 => LiquidityIntent) private intents;

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

    function submitCreatePoolIntent(uint8 asset0, uint8 asset1, uint16 feeBips) external returns (bytes32 intentId) {
        _validateAssetPair(asset0, asset1);
        if (feeBips < MIN_POOL_FEE_BIPS || feeBips > MAX_POOL_FEE_BIPS) {
            revert InvalidFeeBips(feeBips);
        }
        intentId = _storeIntent(OP_CREATE_POOL, asset0, asset1, feeBips, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    function submitAddLiquidityIntent(
        uint8 asset0,
        uint8 asset1,
        uint64 amount0,
        uint64 amount1,
        uint64 minLP
    ) external returns (bytes32 intentId) {
        _validateAssetPair(asset0, asset1);
        if (amount0 == 0 || amount1 == 0) {
            revert InvalidAmount();
        }
        intentId = _storeIntent(OP_ADD_LIQUIDITY, asset0, asset1, 0, amount0, amount1, minLP, 0, 0, 0, 0, 0);
    }

    function submitRemoveLiquidityIntent(
        uint8 asset0,
        uint8 asset1,
        uint64 lpAmount,
        uint64 minAmount0,
        uint64 minAmount1
    ) external returns (bytes32 intentId) {
        _validateAssetPair(asset0, asset1);
        if (lpAmount == 0) {
            revert InvalidAmount();
        }
        intentId = _storeIntent(OP_REMOVE_LIQUIDITY, asset0, asset1, 0, 0, 0, 0, lpAmount, minAmount0, minAmount1, 0, 0);
    }

    function submitSwapExactInIntent(
        uint8 assetIn,
        uint8 assetOut,
        uint64 amountIn,
        uint64 minAmountOut
    ) external returns (bytes32 intentId) {
        _validateAssetPair(assetIn, assetOut);
        if (amountIn == 0) {
            revert InvalidAmount();
        }
        intentId = _storeIntent(OP_SWAP_EXACT_IN, assetIn, assetOut, 0, 0, 0, 0, 0, 0, 0, amountIn, minAmountOut);
    }

    function markIntentExecuted(bytes32 intentId, bytes32 veilTxHash) external onlyRelay {
        LiquidityIntent storage intent = intents[intentId];
        if (intent.state == IntentState.NONE) {
            revert IntentNotFound(intentId);
        }
        if (intent.state != IntentState.SUBMITTED) {
            revert IntentNotSubmitted(intentId);
        }
        intent.state = IntentState.EXECUTED;
        emit LiquidityIntentExecuted(intentId, veilTxHash, msg.sender);
    }

    function cancelIntent(bytes32 intentId) external {
        LiquidityIntent storage intent = intents[intentId];
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
        emit LiquidityIntentCancelled(intentId, msg.sender);
    }

    function getIntent(bytes32 intentId) external view returns (LiquidityIntent memory) {
        LiquidityIntent memory intent = intents[intentId];
        if (intent.state == IntentState.NONE) {
            revert IntentNotFound(intentId);
        }
        return intent;
    }

    function _storeIntent(
        uint8 operation,
        uint8 asset0,
        uint8 asset1,
        uint16 feeBips,
        uint64 amount0,
        uint64 amount1,
        uint64 minLP,
        uint64 lpAmount,
        uint64 minAmount0,
        uint64 minAmount1,
        uint64 amountIn,
        uint64 minAmountOut
    ) internal returns (bytes32 intentId) {
        if (operation > OP_SWAP_EXACT_IN) {
            revert InvalidOperation(operation);
        }

        uint64 nonce = nonces[msg.sender];
        nonces[msg.sender] = nonce + 1;
        intentId = keccak256(
            abi.encode(
                block.chainid,
                address(this),
                msg.sender,
                operation,
                asset0,
                asset1,
                feeBips,
                amount0,
                amount1,
                minLP,
                lpAmount,
                minAmount0,
                minAmount1,
                amountIn,
                minAmountOut,
                nonce
            )
        );

        if (intents[intentId].state != IntentState.NONE) {
            revert IntentAlreadyExists(intentId);
        }

        intents[intentId] = LiquidityIntent({
            trader: msg.sender,
            operation: operation,
            asset0: asset0,
            asset1: asset1,
            feeBips: feeBips,
            amount0: amount0,
            amount1: amount1,
            minLP: minLP,
            lpAmount: lpAmount,
            minAmount0: minAmount0,
            minAmount1: minAmount1,
            amountIn: amountIn,
            minAmountOut: minAmountOut,
            nonce: nonce,
            state: IntentState.SUBMITTED
        });

        emit LiquidityIntentSubmitted(
            intentId,
            msg.sender,
            operation,
            asset0,
            asset1,
            feeBips,
            amount0,
            amount1,
            minLP,
            lpAmount,
            minAmount0,
            minAmount1,
            amountIn,
            minAmountOut,
            nonce
        );
    }

    function _validateAssetPair(uint8 asset0, uint8 asset1) internal pure {
        if (!_isSupportedAsset(asset0)) {
            revert InvalidAsset(asset0);
        }
        if (!_isSupportedAsset(asset1)) {
            revert InvalidAsset(asset1);
        }
        if (asset0 == asset1) {
            revert InvalidAssetPair(asset0, asset1);
        }
    }

    function _isSupportedAsset(uint8 asset) internal pure returns (bool) {
        return asset == ASSET_VEIL || asset == ASSET_VAI;
    }
}
