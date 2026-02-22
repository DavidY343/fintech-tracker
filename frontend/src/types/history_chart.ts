export interface PortfolioPoint {
  date: string;
  total_value: string;
  capital_invertido: string;
}

export interface PortfolioHistoryResponse {
  history: PortfolioPoint[];
}

export interface ChartDataPoint {
  day: string;
  total_value: number; 
  capital_invertido: number;
  profit: number;
  displayDate: string;
}