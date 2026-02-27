import './style.css'
import { fetchGDPData, calculateTotalGDP, calculateAverageGrowth, formatNumber, formatGrowthRate } from './gdpService.js'

const app = document.querySelector('#app')

function createHeader(totalGDP, avgGrowth) {
  return `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1>全国各省GDP数据展示</h1>
          <div class="header-info">
            <div class="stat-item">
              <div class="stat-label">总GDP</div>
              <div class="stat-value">${formatNumber(totalGDP)} 亿元</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均增长率</div>
              <div class="stat-value">${avgGrowth.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
}

function createGDPCard(item) {
  const provinceName = item.provinces?.name || '未知'
  const provinceCode = item.provinces?.code || 'N/A'
  const growthClass = item.growth_rate >= 0 ? 'growth-positive' : 'growth-negative'

  return `
    <div class="gdp-card">
      <div class="card-header">
        <div class="province-name">${provinceName}</div>
        <div class="province-code">${provinceCode}</div>
      </div>
      <div class="card-content">
        <div class="data-row">
          <div class="data-label">GDP总值</div>
          <div class="data-value">${formatNumber(item.gdp)} 亿元</div>
        </div>
        <div class="data-row">
          <div class="data-label">增长率</div>
          <div class="data-value ${growthClass}">
            <span class="growth-rate">${formatGrowthRate(item.growth_rate)}</span>
          </div>
        </div>
        <div class="data-row">
          <div class="data-label">人均GDP</div>
          <div class="data-value">${formatNumber(item.per_capita_gdp)} 元</div>
        </div>
        <div class="data-row">
          <div class="data-label">人口</div>
          <div class="data-value">${formatNumber(item.population)} 万人</div>
        </div>
      </div>
    </div>
  `
}

function createBarChart(gdpData) {
  const maxGDP = Math.max(...gdpData.map(item => parseFloat(item.gdp)))

  const bars = gdpData.map(item => {
    const percentage = (parseFloat(item.gdp) / maxGDP) * 100
    return `
      <div class="bar-item">
        <div class="bar-label">${item.provinces?.name || '未知'}</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${percentage}%">
            <span class="bar-value">${formatNumber(item.gdp)}</span>
          </div>
        </div>
      </div>
    `
  }).join('')

  return `
    <div class="chart-section">
      <h2 class="chart-title">各省GDP对比</h2>
      <div class="bar-chart">
        ${bars}
      </div>
    </div>
  `
}

function showLoading() {
  app.innerHTML = `
    <div class="loading">加载中...</div>
  `
}

function showError(message) {
  app.innerHTML = `
    <div class="container">
      <div class="error">错误: ${message}</div>
    </div>
  `
}

async function initApp() {
  showLoading()

  try {
    const gdpData = await fetchGDPData()

    if (!gdpData || gdpData.length === 0) {
      showError('没有找到GDP数据')
      return
    }

    const totalGDP = await calculateTotalGDP(gdpData)
    const avgGrowth = await calculateAverageGrowth(gdpData)

    const cardsHTML = gdpData.map(item => createGDPCard(item)).join('')

    app.innerHTML = `
      ${createHeader(totalGDP, avgGrowth)}
      <main class="main-content">
        <div class="container">
          <div class="gdp-grid">
            ${cardsHTML}
          </div>
          ${createBarChart(gdpData)}
        </div>
      </main>
    `
  } catch (error) {
    showError(error.message)
    console.error('Error loading GDP data:', error)
  }
}

initApp()
