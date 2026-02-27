export interface PerformanceMetric {
  pct: number;
  abs: number;
}

export interface PerformanceResponse {
  month: PerformanceMetric;
  three_months: PerformanceMetric;
  ytd: PerformanceMetric;
  total: PerformanceMetric;
}