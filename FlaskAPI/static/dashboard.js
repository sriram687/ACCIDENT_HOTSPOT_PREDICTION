// ===================================
// Dashboard JavaScript with Chart.js
// ===================================

// Chart.js default configuration
Chart.defaults.color = '#D1D5DB';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.font.family = 'Urbanist, sans-serif';

// Color scheme
const colors = {
    purple: '#A855F7',
    cyan: '#0EA5E9',
    pink: '#EC4899',
    orange: '#F97316',
    green: '#10B981',
    red: '#EF4444'
};

// Store chart instances globally
let charts = {
    trafficIncident: null,
    accidentTrend: null,
    weatherImpact: null,
    timeOfDay: null
};

// Current time range
let currentRange = 'today';

// Gradient helper
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Fetch dashboard data from API
async function fetchDashboardData(range) {
    try {
        const response = await fetch(`/api/dashboard-stats?range=${range}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            return data.stats;
        } else {
            console.error('Error fetching dashboard data:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}

// Update stats cards
function updateStatsCards(stats) {
    const cards = [
        { selector: '.stat-card-dash:nth-child(1) .stat-value', value: stats.total_incidents.toLocaleString() },
        { selector: '.stat-card-dash:nth-child(1) .stat-change span', value: `${Math.abs(stats.incident_change)}% decrease` },
        { selector: '.stat-card-dash:nth-child(2) .stat-value', value: stats.active_hotspots.toString() },
        { selector: '.stat-card-dash:nth-child(2) .stat-change span', value: `${Math.abs(stats.hotspot_change)}% decrease` },
        { selector: '.stat-card-dash:nth-child(3) .stat-value', value: `${stats.avg_response_time}m` },
        { selector: '.stat-card-dash:nth-child(3) .stat-change span', value: `${Math.abs(stats.response_change)}% faster` },
        { selector: '.stat-card-dash:nth-child(4) .stat-value', value: stats.high_risk_areas.toString() },
        { selector: '.stat-card-dash:nth-child(4) .stat-change span', value: `${Math.abs(stats.risk_change)}% decrease` }
    ];
    
    cards.forEach(card => {
        const element = document.querySelector(card.selector);
        if (element) {
            element.textContent = card.value;
        }
    });
}

// Traffic vs Incident Chart
function initTrafficIncidentChart(data) {
    const ctx = document.getElementById('trafficIncidentChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (charts.trafficIncident) {
        charts.trafficIncident.destroy();
    }
    
    charts.trafficIncident = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Traffic Density',
                data: data.traffic,
                borderColor: colors.cyan,
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
            }, {
                label: 'Accidents',
                data: data.accidents,
                borderColor: colors.orange,
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 15, 26, 0.9)',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y;
                            if (context.datasetIndex === 0) label += '%';
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Traffic Density (%)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Accidents'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Accident Trend Chart
function initAccidentTrendChart(data) {
    const ctx = document.getElementById('accidentTrendChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (charts.accidentTrend) {
        charts.accidentTrend.destroy();
    }
    
    charts.accidentTrend = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Minor',
                data: data.minor,
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: colors.green,
                borderWidth: 1
            }, {
                label: 'Moderate',
                data: data.moderate,
                backgroundColor: 'rgba(249, 115, 22, 0.7)',
                borderColor: colors.orange,
                borderWidth: 1
            }, {
                label: 'Severe',
                data: data.severe,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: colors.red,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 15, 26, 0.9)',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Accidents'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            }
        }
    });
}

// Weather Impact Chart
function initWeatherImpactChart(data) {
    const ctx = document.getElementById('weatherImpactChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (charts.weatherImpact) {
        charts.weatherImpact.destroy();
    }
    
    charts.weatherImpact = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(249, 115, 22, 0.8)'
                ],
                borderColor: [
                    colors.green,
                    colors.cyan,
                    '#9CA3AF',
                    colors.pink,
                    colors.purple,
                    colors.orange
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 15, 26, 0.9)',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${percentage}%`;
                        }
                    }
                }
            }
        }
    });
}

// Time of Day Chart
function initTimeOfDayChart(data) {
    const ctx = document.getElementById('timeOfDayChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (charts.timeOfDay) {
        charts.timeOfDay.destroy();
    }
    
    // Determine if we have weekday/weekend or single dataset
    const datasets = [];
    
    if (data.weekday && data.weekend) {
        datasets.push({
            label: 'Weekday',
            data: data.weekday,
            borderColor: colors.purple,
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            pointBackgroundColor: colors.purple,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: colors.purple
        });
        datasets.push({
            label: 'Weekend',
            data: data.weekend,
            borderColor: colors.cyan,
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            pointBackgroundColor: colors.cyan,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: colors.cyan
        });
    } else if (data.current) {
        datasets.push({
            label: 'Current Day',
            data: data.current,
            borderColor: colors.purple,
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            pointBackgroundColor: colors.purple,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: colors.purple
        });
    }
    
    charts.timeOfDay = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 15, 26, 0.9)',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#D1D5DB',
                        font: {
                            size: 11
                        }
                    },
                    ticks: {
                        color: '#9CA3AF',
                        backdropColor: 'transparent'
                    }
                }
            }
        }
    });
}

// Update all charts with new data
async function updateAllCharts(range) {
    currentRange = range;
    
    // Show loading state
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <i class="ph ph-circle-notch" style="animation: spin 1s linear infinite;"></i>
            <p>Loading ${range} data...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Fetch new data
    const stats = await fetchDashboardData(range);
    
    // Remove loading overlay
    document.body.removeChild(loadingOverlay);
    
    if (stats) {
        // Update stats cards
        updateStatsCards(stats);
        
        // Update all charts
        initTrafficIncidentChart(stats.traffic_chart);
        initAccidentTrendChart(stats.trend_chart);
        initWeatherImpactChart(stats.weather_chart);
        initTimeOfDayChart(stats.time_chart);
        
        // Trigger animation
        setTimeout(animateStats, 100);
    }
}

// Time Range Selector
function setupTimeRangeSelector() {
    const timeBtns = document.querySelectorAll('.time-btn');
    
    timeBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            timeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const range = this.getAttribute('data-range');
            console.log('Time range changed to:', range);
            
            // Update dashboard with new range
            await updateAllCharts(range);
        });
    });
}

// Animate stats on load
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const text = stat.textContent;
        const hasPercent = text.includes('%');
        const hasM = text.includes('m');
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (!isNaN(number)) {
            let current = 0;
            const increment = number / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                let display = Math.floor(current).toLocaleString();
                if (hasPercent) display += '%';
                if (hasM) display += 'm';
                
                stat.textContent = display;
            }, 50);
        }
    });
}

// Initialize all charts with initial data
async function initializeCharts() {
    const stats = await fetchDashboardData('today');
    if (stats) {
        updateStatsCards(stats);
        initTrafficIncidentChart(stats.traffic_chart);
        initAccidentTrendChart(stats.trend_chart);
        initWeatherImpactChart(stats.weather_chart);
        initTimeOfDayChart(stats.time_chart);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('trafficIncidentChart')) {
        initializeCharts();
        setupTimeRangeSelector();
        
        // Animate stats after a short delay
        setTimeout(animateStats, 300);
    }
});

// CSS for loading overlay
const style = document.createElement('style');
style.textContent = `
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(11, 15, 26, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-spinner {
    text-align: center;
    color: #A855F7;
}

.loading-spinner i {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.loading-spinner p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

// Export functions
window.DashboardFunctions = {
    initializeCharts,
    animateStats,
    updateAllCharts
};
