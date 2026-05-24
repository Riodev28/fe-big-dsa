export interface BigOAiResult {
  analysis: Analysis;
  ai: AI
}

export interface Analysis {
  time_complexity: string;
  max_loop_depth: number;
  recursive: boolean
}

export interface AI {
  temporal_explanation: string
}
