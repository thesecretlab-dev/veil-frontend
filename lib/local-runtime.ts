/**
 * Canonical local runtime. Local ≠ Fuji ≠ mainnet.
 * HyperSDK app-id 22207 is not an EVM chain id. Companion wallets talk to anvil 31337.
 */

export const LOCAL_VEILVM_CHAIN_ID = "bdRGUMA7rzZFXjbn1ePTjqhAUfTjW94e69p7qZd4puZ3uEosL"
export const LOCAL_VEILVM_APP_ID = 22207
export const LOCAL_SUBNET_ID = "AkMZ5HpwZRuB1CY7M6HvUmHuVipiRUKD1dTyLmkoQFe8qqMrC"
export const LOCAL_NODE_ID = "NodeID-HMqe6QZg8h7Bb3minFk2YruUeGzdhy94H"
export const LOCAL_NODE = (process.env.VEIL_NODE_URL || "http://127.0.0.1:9660").replace(/\/+$/, "")
export const LOCAL_ROUTER = (process.env.VEIL_ORDER_API_BASE || "http://127.0.0.1:9098").replace(/\/+$/, "")
export const LOCAL_COMPANION_RPC = (process.env.VEIL_COMPANION_RPC || "http://127.0.0.1:8545").replace(/\/+$/, "")
export const LOCAL_COMPANION_CHAIN_ID = 31337
/** Mesh is TSL's RPC product. Origins stay on the node; clients should hit Mesh. */
export const MESH_HTTP = (process.env.MESH_URL || "http://127.0.0.1:8787").replace(/\/+$/, "")
export const MESH_KEY = (process.env.MESH_API_KEY || "mesh_local_dev").trim()

export const LOCAL_ORDER_GATEWAY =
  process.env.VEIL_ORDER_GATEWAY || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
export const LOCAL_LIQ_GATEWAY =
  process.env.VEIL_LIQUIDITY_GATEWAY || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
export const LOCAL_WVEIL = process.env.VEIL_WVEIL || "0x5FbDB2315678afecb367f032d93F642f64180aa3"
/** Companion ZER0ID nullifier registry (digest-bound 8004). Not Groth16. */
export const LOCAL_ZEROID_REGISTRY =
  process.env.ZEROID_REGISTRY || "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"

export function veilCoreApi(): string {
  return `${LOCAL_NODE}/ext/bc/${LOCAL_VEILVM_CHAIN_ID}/coreapi`
}

export function veilJsonApi(): string {
  return `${LOCAL_NODE}/ext/bc/${LOCAL_VEILVM_CHAIN_ID}/veilapi`
}
