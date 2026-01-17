import { useEffect, useState } from 'react'
import { AssetTableRow } from '../../types/asset'
import { getAllAssets } from '../../services/assetService'
import { TrendingUp, TrendingDown, Wallet, ChevronUp, ChevronDown } from 'lucide-react'

export default function AssetsTable() {
  const [assets, setAssets] = useState<AssetTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof AssetTableRow>('total_value')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      setLoading(true)
      const data = await getAllAssets()
      setAssets(data || [])
    } catch (error) {
      console.error('Error al obtener assets:', error)
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value && value !== 0) return '-'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = (value?: number) => {
    if (!value && value !== 0) return '-'
    return new Intl.NumberFormat('es-ES', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'exceptZero'
    }).format(value / 100)
  }

  const formatNumber = (value?: number) => {
    if (!value && value !== 0) return '-'
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })
  }

  const handleSort = (field: keyof AssetTableRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortAssets = (assets: AssetTableRow[]) => {
    return [...assets].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      // Manejar valores undefined
      if (aValue === undefined || aValue === null) aValue = sortDirection === 'asc' ? Infinity : -Infinity
      if (bValue === undefined || bValue === null) bValue = sortDirection === 'asc' ? Infinity : -Infinity
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }

  const sortedAssets = sortAssets(assets)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Cargando activos...</div>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">No hay activos para mostrar</div>
      </div>
    )
  }

  const totalValue = assets.reduce((sum, asset) => sum + (asset.total_value || 0), 0)

  return (
    <div className="space-y-6">
      {/* Encabezado con total y ordenación */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Detalle por activo</h2>
          <p className="text-sm text-gray-400">
            Mostrando {assets.length} activo{assets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-1.5 rounded-lg text-base font-medium transition-all ${
                sortField === 'name'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1">
                Nombre
                {sortField === 'name' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
            </button>
            
            <button
              onClick={() => handleSort('total_value')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortField === 'total_value'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1">
                Valor total
                {sortField === 'total_value' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
            </button>
            
            <button
              onClick={() => handleSort('performance')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortField === 'performance'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1">
                Rendimiento
                {sortField === 'performance' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
            </button>
            
            <button
              onClick={() => handleSort('invested_value')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortField === 'invested_value'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1">
                Invertido
                {sortField === 'invested_value' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
            </button>
            
            <button
              onClick={() => handleSort('account_name')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortField === 'account_name'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1">
                Cuenta
                {sortField === 'account_name' && (
                  sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
            </button>
          </div>
        </div>


      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 gap-6">
        {sortedAssets.map((asset) => (
          <div 
            key={`${asset.asset_id}-${asset.account_id}`}
            className="bg-[#11162A] border border-white/10 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Encabezado de la tarjeta */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="font-mono text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                          {asset.ticker}
                        </span>
                        <span className="text-sm text-gray-300">{asset.type}</span>
                        {asset.theme && asset.theme !== 'Unclassified' && (
                          <span className="text-sm text-gray-400">• {asset.theme}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {asset.isin && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ISIN: {asset.isin}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(asset.total_value)}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">
                    {asset.account_name}
                  </div>
                </div>
              </div>

              {/* Grid de métricas */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <p className="text-base text-gray-400">Cantidad</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(asset.quantity)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-base text-gray-400">Precio actual</p>
                  <p className="text-xl font-semibold text-white">
                    {formatCurrency(asset.current_price)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-base text-gray-400">Valor actual</p>
                  <p className="text-xl font-semibold text-white">
                    {formatCurrency(asset.quantity * asset.current_price)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-base text-gray-400">Valor invertido</p>
                  <p className="text-xl font-semibold text-white">
                    {formatCurrency(asset.invested_value)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-base text-gray-400">Rendimiento</p>
                  <div className="flex items-center gap-2">
                    {(asset.performance || 0) >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    )}
                    <p className={`text-xl font-semibold ${
                      (asset.performance || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatPercentage(asset.performance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra de porcentaje */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Porcentaje del total</span>
                  <span>{((asset.total_value / totalValue) * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-violet-600 rounded-full"
                    style={{ width: `${(asset.total_value / totalValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div>• Mostrando todos los activos de todas las cuentas</div>
          <div>• Ordenados por: {
            sortField === 'name' ? 'Nombre' :
            sortField === 'total_value' ? 'Valor total' :
            sortField === 'performance' ? 'Rendimiento' :
            sortField === 'invested_value' ? 'Valor invertido' :
            sortField === 'account_name' ? 'Cuenta' :
            sortField
          } ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})</div>
          <div>• Total: {formatCurrency(totalValue)}</div>
        </div>
      </div>
    </div>
  )
}