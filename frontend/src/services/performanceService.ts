import { apiGet } from './api'
import { PerformanceResponse } from '../types/performance';


/**
 * Obtiene las métricas de rendimiento (1m, 3m, YTD, Total)
 */
export async function getPerformanceMetrics(): Promise<PerformanceResponse> {
  try {
    return await apiGet<PerformanceResponse>('/portfolio/performance', true);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
}