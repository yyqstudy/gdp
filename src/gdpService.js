import { supabase } from './supabase.js'

export async function fetchGDPData() {
  const { data, error } = await supabase
    .from('gdp_data')
    .select(`
      *,
      provinces (
        name,
        code
      )
    `)
    .order('gdp', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch GDP data: ${error.message}`)
  }

  return data
}

export async function calculateTotalGDP(gdpData) {
  return gdpData.reduce((sum, item) => sum + parseFloat(item.gdp || 0), 0)
}

export async function calculateAverageGrowth(gdpData) {
  if (gdpData.length === 0) return 0
  const totalGrowth = gdpData.reduce((sum, item) => sum + parseFloat(item.growth_rate || 0), 0)
  return totalGrowth / gdpData.length
}

export function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万亿'
  }
  return num.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

export function formatGrowthRate(rate) {
  const rateNum = parseFloat(rate)
  return rateNum >= 0 ? `+${rateNum}%` : `${rateNum}%`
}
