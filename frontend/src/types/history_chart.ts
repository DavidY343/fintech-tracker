export interface PortfolioPoint {
  day: string;
  total_value: string;
}

export interface PortfolioHistoryResponse {
  history: PortfolioPoint[];
}