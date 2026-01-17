import { AssetAllocation, AssetTableRow } from '../types/asset'
import { apiGet } from './api'



export async function getGlobalAssetAllocation(groupBy: 'type' | 'theme' | 'asset'): Promise<AssetAllocation[]> {

    try {
        const data = await apiGet<AssetAllocation[]>(`/portfolio/assets/${groupBy}`, true)
        return data
    } catch (error) {
        console.error('Error fetching global asset allocation:', error)
        throw error
    }
}

export async function getAccountAssetAllocation(accountId: number, groupBy: 'type' | 'theme' | 'asset' ): Promise<AssetAllocation[]> {

    try {
        const data = await apiGet<AssetAllocation[]>(`/portfolio/assets/${groupBy}/${accountId}`, true)
        return data
    } catch (error) {
        console.error('Error fetching account asset allocation:', error)
        throw error
    }
}

export async function getAllAssets(): Promise<AssetTableRow[]> {
    try {
        const data = await apiGet<AssetTableRow[]>('/portfolio/assets/all', true)
        return data
    } catch (error) {
        console.error('Error fetching all assets:', error)
        throw error
    }
}