import {
  LOCAL_COMPANION_CHAIN_ID,
  LOCAL_COMPANION_RPC,
  LOCAL_NODE,
  LOCAL_VEILVM_APP_ID,
  LOCAL_VEILVM_CHAIN_ID,
  veilCoreApi,
  veilJsonApi,
} from "@/lib/local-runtime"
import { profilePublic } from "@/lib/runtime-profile"

export const MESH_NAME = "Mesh"
export const MESH_OPERATOR = "THE SECRET LAB"
export const MESH_PORT = Number(process.env.MESH_PORT || 8787)
export const MESH_KEY = (process.env.MESH_API_KEY || "mesh_local_dev").trim()
export const MESH_REQUIRE_KEY = process.env.MESH_REQUIRE_KEY === "1" || process.env.NODE_ENV === "production"

export type MeshLane = "veil" | "core" | "indexer" | "evm"

export function meshOrigins() {
  return {
    veil: veilJsonApi(),
    core: veilCoreApi(),
    indexer: `${LOCAL_NODE}/ext/bc/${LOCAL_VEILVM_CHAIN_ID}/indexer`,
    evm: LOCAL_COMPANION_RPC,
    nodeHealth: `${LOCAL_NODE}/ext/health`,
  }
}

export function meshCatalog(base: string) {
  const origin = base.replace(/\/+$/, "")
  return {
    product: MESH_NAME,
    operator: MESH_OPERATOR,
    local: true,
    profile: profilePublic(),
    note: "Local Mesh. Not Fuji. Not mainnet. Not a public Infura. VeilVM app-id 22207 is not an EVM chain id.",
    keyHeader: "x-mesh-key",
    keyQuery: "key",
    defaultKey: MESH_REQUIRE_KEY ? undefined : MESH_KEY,
    networks: [
      {
        id: "veilvm",
        label: "VeilVM",
        kind: "hypersdk",
        chainId: LOCAL_VEILVM_CHAIN_ID,
        appId: LOCAL_VEILVM_APP_ID,
        lanes: {
          core: `${origin}/v1/core`,
          veil: `${origin}/v1/veil`,
          indexer: `${origin}/v1/indexer`,
        },
      },
      {
        id: "companion",
        label: "Companion EVM",
        kind: "evm",
        chainId: LOCAL_COMPANION_CHAIN_ID,
        lanes: {
          evm: `${origin}/v1/evm`,
        },
      },
    ],
  }
}
