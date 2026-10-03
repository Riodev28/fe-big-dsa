export interface TemporalAiResult {
  analysis: TimeComplexityAnalysis
  ai: TemporalAI
}

export interface SpatialAiResult {
  analysis: SpatialComplexityAnalysis
  ai: SpatialAI
}

export interface AuthResult {
  access_token: string
  token_type: string
}

export interface UserResult {
  id: string | null
  username: string
  email: string
}

export interface FileResult {
  id: string | null
  title: string
  algorithm_name: string | null
  content: string
  user: UserResult
  created_at: string
  updated_at: string | null
}

export interface BigOAiResult {
  time_analysis: TimeComplexityAnalysis
  spatial_analysis: SpatialComplexityAnalysis
  ai: AI
}

export interface SpatialComplexityAnalysis {
  space_complexity: string
  total_allocations: number
  list_allocations: number
  dict_allocations: number
  set_allocations: number
  comprehensions: number
  recursive_functions: number
  generator_expressions: number
  dynamic_growth_operations: number

}
export interface TimeComplexityAnalysis {
  time_complexity: string
  max_loop_depth: number
  recursive: boolean
}

export interface AI {
  temporal_explanation: string
  spatial_explanation: string
}

export interface TemporalAI {
  temporal_explanation: string
}

export interface SpatialAI {
  spatial_explanation: string
}

// ---- analytics -------------------------------------------------------------

export type AnalysisKind = 'temporal' | 'spatial'

export type Severity = 'good' | 'warning' | 'critical'

export type ComplexityClassKey =
  | 'constant'
  | 'logarithmic'
  | 'linear'
  | 'linearithmic'
  | 'quadratic'
  | 'cubic'
  | 'polynomial'
  | 'exponential'

export interface ComplexityClassInfo {
  key: ComplexityClassKey
  label: string
  severity: Severity
}

export interface TotalAnalysesMetric {
  value: number
  this_week: number
  last_week: number
  /** null when there were no analyses last week: growth from zero is undefined */
  change_vs_last_week_pct: number | null
}

export interface ModeComplexityMetric {
  notation: string
  complexity_class: ComplexityClassInfo
  occurrences: number
  share_pct: number
}

export interface DashboardSummaryResult {
  kind: AnalysisKind
  total_analyses: TotalAnalysesMetric
  mode_complexity: ModeComplexityMetric | null
  average_analysis_time_ms: number | null
  code_health_score: number | null
}

export interface TrendPoint {
  /** "YYYY-MM" */
  month: string
  /** null = no analyses that month, not a score of 0 */
  current: number | null
  baseline: number | null
}

export interface ComplexityTrendsResult {
  kind: AnalysisKind
  metric: 'code_health_score'
  points: TrendPoint[]
}

export interface AnalysisListItem {
  id: string
  title: string | null
  kind: AnalysisKind
  complexity: string
  complexity_class: ComplexityClassInfo
  language: string
  created_at: string
}

export interface AnalysisPage {
  items: AnalysisListItem[]
  total: number
  limit: number
  offset: number
}

export interface VariableRef {
  symbol: string
  source: string
}

interface AnalysisReportBase {
  complexity_class: ComplexityClassKey
  terms: string[]
  variables: VariableRef[]
  recursion_kind: string | null
}

export interface TemporalAnalysisReport extends AnalysisReportBase {
  time_complexity: string
  max_loop_depth: number
  recursive: boolean
  loop_count: number
}

export interface SpatialAnalysisReport extends AnalysisReportBase {
  space_complexity: string
  total_allocations: number
  list_allocations: number
  dict_allocations: number
  set_allocations: number
  comprehensions: number
  recursive_functions: number
  generator_expressions: number
  dynamic_growth_operations: number
}

interface AnalysisDetailBase extends Omit<AnalysisListItem, 'kind'> {
  code: string
  duration_ms: number
  cached: boolean
  ai_explained: boolean
}

// Discriminated on `kind`, so narrowing it also narrows the report shape
export type AnalysisDetailResult =
  | (AnalysisDetailBase & { kind: 'temporal'; report: TemporalAnalysisReport })
  | (AnalysisDetailBase & { kind: 'spatial'; report: SpatialAnalysisReport })
