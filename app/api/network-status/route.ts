import { NextResponse } from "next/server"

const VEILVM_RPC = "http://127.0.0.1:9660"
const AVAGO_RPC = "http://127.0.0.1:9650"
const CHAIN_ID = "2L5JWLhXnDm8dPyBFMjBuqsbPSytL4bfbGJJj37jk5ri1KdXhd"

async function rpc(url: string, method: string, params: unknown = {}) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: AbortSignal.timeout(3000),
    })
    const data = await res.json()
    return data.result
  } catch {
    return null
  }
}

export async function GET() {
  const [peers, nodeId, blockHeight, peerCount] = await Promise.all([
    // Get peers tracking VEIL subnet
    rpc(`${AVAGO_RPC}/ext/info`, "info.peers"),
    rpc(`${AVAGO_RPC}/ext/info`, "info.getNodeID"),
    // VeilVM block height
    rpc(`${VEILVM_RPC}/ext/bc/${CHAIN_ID}/rpc`, "eth_blockNumber"),
    // Companion EVM peer count
    rpc(`${AVAGO_RPC}/ext/bc/${CHAIN_ID}/rpc`, "net_peerCount"),
  ])

  // Filter peers that track the VEIL subnet
  const subnetId = "hW1PX8sV3HUf7ZVLeCN5wcFAGQyypyMqfdEsUX6787MUV9maf"
  const allPeers = peers?.peers || []
  const veilPeers = allPeers.filter((p: { trackedSubnets?: string[] }) =>
    p.trackedSubnets?.includes(subnetId)
  )

  // Build validator list from subnet peers + self
  const validators = [
    {
      nodeId: nodeId?.nodeID || "NodeID-self",
      role: "primary",
      active: true,
      label: "Primary Validator",
    },
    ...veilPeers.map((p: { nodeID: string; ip: string; version: string }, i: number) => ({
      nodeId: p.nodeID,
      role: i === 0 ? "secondary" : "peer",
      active: true,
      label: p.nodeID.slice(0, 20) + "...",
      ip: p.ip,
      version: p.version,
    })),
  ]

  return NextResponse.json({
    chainId: 22207,
    blockHeight: blockHeight ? parseInt(blockHeight, 16) : null,
    totalPeers: allPeers.length,
    subnetPeers: veilPeers.length,
    validators,
    timestamp: new Date().toISOString(),
  })
}
