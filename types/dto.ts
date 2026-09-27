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
