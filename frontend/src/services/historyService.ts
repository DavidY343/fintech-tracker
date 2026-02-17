import { apiGet } from './api'
import { PortfolioHistoryResponse } from '../types/history_chart'

/**
 * Obtiene los puntos de datos para el gráfico de crecimiento del patrimonio
 */
export async function getPortfolioGrowth(): Promise<PortfolioHistoryResponse> {
  try {
    const data = await apiGet<PortfolioHistoryResponse>('/history_chart/growth', true)
    return data
  } catch (error) {
    console.error('Error fetching portfolio growth:', error)
    throw error
  }
}