// ===================================
// Dashboard JavaScript with Chart.js
// ===================================

// Global variables
let currentRange = 'today';
let charts = {};

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

// Gradient helper
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update stats cards
function updateStatsCards(stats) {
    // Total incidents
    const totalIncidentsEl = document.getElementById('totalIncidents');
    if (totalIncidentsEl) {
        animateNumber(totalIncidentsEl, 0, stats.total_incidents, 1000);
    }
    
    // Incident change
    const changeEl = document.getElementById('incidentChange');
    if (changeEl) {
        const change = stats.incident_change;
        const isPositive = change < 0; // Negative change is good (fewer incidents)
        const icon = changeEl.querySelector('i');
        const span = changeEl.querySelector('span');
        
        if (isPositive) {
            changeEl.className = 'stat-change positive';
            icon.className = 'ph ph-arrow-down';
            span.textContent = `${Math.abs(change).toFixed(1)}% decrease`;
        } else if (change > 0) {
            changeEl.className = 'stat-change negative';
            icon.className = 'ph ph-arrow-up';
            span.textContent = `${change.toFixed(1)}% increase`;
        } else {
            changeEl.className = 'stat-change neutral';
            icon.className = 'ph ph-minus';
            span.textContent = 'No change';
        }
    }
    
    // Active hotspots
    const hotspotsEl = document.getElementById('activeHotspots');
    if (hotspotsEl) {
        animateNumber(hotspotsEl, 0, stats.active_hotspots, 1000);
    }
    
    // Avg response time
    const responseEl = document.getElementById('avgResponseTime');
    if (responseEl) {
        responseEl.textContent = stats.avg_response_time;
    }
    
    // Prediction accuracy
    const accuracyEl = document.getElementById('predictionAccuracy');
    if (accuracyEl) {
        accuracyEl.textContent = stats.prediction_accuracy + '%';
    }
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    let startTime = null;
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Fetch dashboard data
async function fetchDashboardData(range) {
    try {
        const response = await fetch(`/api/dashboard-data?range=${range}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            // Update stats cards
            updateStatsCards(data.stats);
            
            // Update all charts
            updateTrafficIncidentChart(data.charts.traffic_vs_incidents);
            updateAccidentTrendChart(data.charts.trend_analysis);
            updateWeatherImpactChart(data.charts.weather_impact);
            updateTimeOfDayChart(data.charts.time_distribution);
        } else {
            console.error('Error fetching dashboard data:', data.message);
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

// Update Traffic vs Incident Chart
function updateTrafficIncidentChart(data) {
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
                data: data.incidents,
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
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            }
        }
    });
}

// Update Accident Trend Chart
function updateAccidentTrendChart(data) {
    const ctx = document.getElementById('accidentTrendChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (charts.accidentTrend) {
        charts.accidentTrend.destroy();
    }
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
function initAccidentTrendChart() {
    const ctx = document.getElementById('accidentTrendChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Minor',
                data: [45, 52, 48, 42],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: colors.green,
                borderWidth: 1
            }, {
                label: 'Moderate',
                data: [28, 32, 30, 25],
                backgroundColor: 'rgba(249, 115, 22, 0.7)',
                borderColor: colors.orange,
                borderWidth: 1
            }, {
                label: 'Severe',
                data: [12, 15, 14, 10],
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
function initWeatherImpactChart() {
    const ctx = document.getElementById('weatherImpactChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Clear', 'Rain', 'Fog', 'Snow', 'Cloudy', 'Other'],
            datasets: [{
                data: [35, 25, 15, 10, 10, 5],
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
function initTimeOfDayChart() {
    const ctx = document.getElementById('timeOfDayChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['12AM-3AM', '3AM-6AM', '6AM-9AM', '9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM', '9PM-12AM'],
            datasets: [{
                label: 'Weekday',
                data: [15, 8, 35, 45, 50, 75, 85, 40],
                borderColor: colors.purple,
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                pointBackgroundColor: colors.purple,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: colors.purple
            }, {
                label: 'Weekend',
                data: [25, 20, 20, 30, 35, 45, 65, 55],
                borderColor: colors.cyan,
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                pointBackgroundColor: colors.cyan,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: colors.cyan
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

// Time Range Selector
function setupTimeRangeSelector() {
    const timeBtns = document.querySelectorAll('.time-btn');
    
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            timeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const range = this.getAttribute('data-range');
            console.log('Time range changed to:', range);
            
            // In production, fetch new data based on range
            // updateDashboardData(range);
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

// Initialize all charts
function initializeCharts() {
    initTrafficIncidentChart();
    initAccidentTrendChart();
    initWeatherImpactChart();
    initTimeOfDayChart();
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

// Export functions
window.DashboardFunctions = {
    initializeCharts,
    animateStats
};
