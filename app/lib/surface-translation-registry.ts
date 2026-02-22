/**
 * VEIL Surface Translation Registry (TypeScript consumer)
 *
 * Auto-generated from docs/claude-handshake/surface-translation-registry.json (v2)
 * Frontend components MUST consume this — no hardcoded claim copy.
 *
 * Updated: 2026-02-22 (synced with backend v2 registry)
 */

import registryData from '../../docs/claude-handshake/surface-translation-registry.json'

// ── Types ──

export type ImplementationStatus =
  | "implemented"
  | "implemented_local"
  | "passing_local"
  | "production_ready"
  | "live_mainnet"
  | "scaffolded"
  | "in_progress"
  | "ops_pending"
  | "pending"
  | "not_started"

export type PrivacyScope =
  | "vm_native_private"
  | "vm_native_public"
  | "evm_interop_public"
  | "mixed"
  | "not_applicable"

export type CtaState = "enabled" | "disabled" | "docs_only" | "waitlist" | "hidden"

export interface SurfaceFeature {
  feature_id: string
  domain: string
  surface_label: string
  implemented: string
  validated_local: boolean
  production_ready: boolean
  live: boolean
  runtime_admitted: boolean
  privacy_scope: PrivacyScope
  surface_owners: {
    protocol_owner: string
    frontend_owner: string
    evidence_owner: string
  }
  ui_action_policy: {
    cta_state: CtaState
    cta_reason: string
    badge?: string
  }
  allowed_copy: string
  forbidden_copy: string[]
  evidence_refs: string[]
  notes: string
}

export interface LaunchStatus {
  decision: string
  gates_total: number
  gates_passing_local: number
  gates_in_progress: number
  gates_failing: number
}

export interface VmActionCoverage {
  total_actions: number
  tier0_admitted: number
  tier0_sdk_implemented: number
  tier1_implemented: number
  tier2_implemented: number
  tier0_actions: string[]
}

// ── Registry Access ──

export const registry = registryData as {
  _meta: Record<string, string>
  launch_status: LaunchStatus & { gate_refs: Record<string, string> }
  features: SurfaceFeature[]
  vm_action_coverage: VmActionCoverage
}

export function getFeature(id: string): SurfaceFeature | undefined {
  return registry.features.find(f => f.feature_id === id)
}

export function getFeaturesByDomain(domain: string): SurfaceFeature[] {
  return registry.features.filter(f => f.domain === domain)
}

export function getFeaturesByCtaState(state: CtaState): SurfaceFeature[] {
  return registry.features.filter(f => f.ui_action_policy.cta_state === state)
}

export function isLive(featureId: string): boolean {
  return getFeature(featureId)?.live === true
}

export function isProductionReady(featureId: string): boolean {
  return getFeature(featureId)?.production_ready === true
}

export function getCtaState(featureId: string): CtaState {
  return getFeature(featureId)?.ui_action_policy.cta_state ?? "hidden"
}

export function getAllowedCopy(featureId: string): string {
  return getFeature(featureId)?.allowed_copy ?? ""
}

export function getBadge(featureId: string): string | undefined {
  return getFeature(featureId)?.ui_action_policy.badge
}

export function getLaunchStatus(): LaunchStatus {
  return registry.launch_status
}

export function getVmCoverage(): VmActionCoverage {
  return registry.vm_action_coverage
}

/** Quick summary for dashboards */
export function getRegistrySummary() {
  const features = registry.features
  return {
    total: features.length,
    live: features.filter(f => f.live).length,
    productionReady: features.filter(f => f.production_ready).length,
    passingLocal: features.filter(f => f.validated_local).length,
    scaffolded: features.filter(f => f.implemented === "scaffolded").length,
    launchDecision: registry.launch_status.decision,
    vmActions: registry.vm_action_coverage.total_actions,
    tier0Coverage: `${registry.vm_action_coverage.tier0_sdk_implemented}/${registry.vm_action_coverage.tier0_admitted}`,
  }
}
