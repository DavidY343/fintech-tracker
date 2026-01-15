import { apiGet } from './api'
import { AccountWithBalance } from './../types/account'

export async function getAccountsWithBalance(): Promise<AccountWithBalance[]> {
  
  try {
    const data = await apiGet<AccountWithBalance[]>(`/portfolio/accounts/`, true)
    return data
  } catch (error) {
    console.error('Error fetching accounts:', error)
    throw error
  }
}

export async function getAccountWithBalance(accountId: number): Promise<AccountWithBalance> {

  try {
    const data = await apiGet<AccountWithBalance[]>(`/portfolio/accounts/${accountId}`, true)
    return data[0]
  } catch (error) {
    console.error('Error fetching account:', error)
    throw error
  }
}