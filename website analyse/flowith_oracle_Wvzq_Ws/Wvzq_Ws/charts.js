const chartConfig = {
    fontColor: '#9ca3af',
    gridColor: 'rgba(55, 65, 81, 0.5)',
};

function createSwotChart(swotData) {
    const ctx = document.getElementById('swotChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: swotData.labels,
            datasets: [{
                label: 'SWOT Analysis',
                data: swotData.values,
                backgroundColor: [
                    'rgba(52, 211, 153, 0.5)', // Strengths - Green
                    'rgba(248, 113, 113, 0.5)', // Weaknesses - Red
                    'rgba(59, 130, 246, 0.5)', // Opportunities - Blue
                    'rgba(251, 191, 36, 0.5)' // Threats - Amber
                ],
                borderColor: [
                    '#34d399',
                    '#f87171',
                    '#3b82f6',
                    '#fbbf24'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: {
                        color: chartConfig.gridColor
                    },
                    angleLines: {
                        color: chartConfig.gridColor
                    },
                    ticks: {
                        color: chartConfig.fontColor,
                        backdropColor: 'transparent',
                        stepSize: 1
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                        },
                        color: chartConfig.fontColor
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: chartConfig.fontColor,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.r !== null) {
                                label += context.parsed.r + ' points';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function createCompetitorChart(breakdownData) {
    const ctx = document.getElementById('competitorChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(breakdownData),
            datasets: [{
                label: 'Number of Key Competitors by Type',
                data: Object.values(breakdownData),
                backgroundColor: [
                    'rgba(248, 113, 113, 0.6)',
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(251, 191, 36, 0.6)',
                    'rgba(52, 211, 153, 0.6)',
                ],
                borderColor: [
                    '#f87171',
                    '#3b82f6',
                    '#fbbf24',
                    '#34d399',
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: chartConfig.gridColor,
                        borderColor: chartConfig.gridColor
                    },
                    ticks: {
                        color: chartConfig.fontColor,
                        stepSize: 1
                    }
                },
                y: {
                     grid: {
                        display: false
                    },
                     ticks: {
                        color: chartConfig.fontColor,
                        font: {
                           size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            }
        }
    });
}


export { createSwotChart, createCompetitorChart };
