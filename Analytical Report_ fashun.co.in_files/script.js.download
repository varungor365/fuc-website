import {
    executiveSummary,
    swotData,
    competitorData,
    onPageAnalysisData,
    technicalAuditData,
    offPageAnalysisData,
    recommendationsData,
    conclusionData
} from './data.js';
import { createSwotChart, createCompetitorChart } from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setReportDate();
    populateExecutiveSummary();
    populateSwotAnalysis();
    populateCompetitorLandscape();
    populateOnPageAnalysis();
    populateTechnicalAudit();
    populateOffPageAnalysis();
    populateRecommendations();
    populateConclusion();
});

function setReportDate() {
    const reportDateEl = document.getElementById('report-date');
    if (reportDateEl) {
        reportDateEl.textContent = `Report generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
}

function createIcon(name, colorClass, size = 'h-5 w-5') {
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', name);
    icon.className = `${size} ${colorClass} inline-block`;
    return icon;
}

function populateExecutiveSummary() {
    const p = document.querySelector('#executive-summary .card p');
    p.innerHTML = executiveSummary;
}

function populateSwotAnalysis() {
    createSwotChart(swotData);

    const icons = {
        strengths: 'zap',
        weaknesses: 'shield-alert',
        opportunities: 'lightbulb',
        threats: 'cloud-lightning'
    };

    const colors = {
        strengths: 'text-green-400',
        weaknesses: 'text-red-400',
        opportunities: 'text-sky-400',
        threats: 'text-amber-400'
    };

    for (const key in swotData.details) {
        const container = document.getElementById(`swot-${key}`);
        if (container) {
            const title = document.createElement('h3');
            title.innerHTML = `<i data-lucide="${icons[key]}" class="${colors[key]}"></i> ${swotData.details[key].title}`;
            
            const list = document.createElement('ul');
            swotData.details[key].points.forEach(point => {
                const li = document.createElement('li');
                li.innerHTML = `<i data-lucide="check-circle-2" class="text-gray-500"></i><span>${point}</span>`;
                list.appendChild(li);
            });
            container.append(title, list);
        }
    }
}

function populateCompetitorLandscape() {
    document.getElementById('competitor-summary').innerHTML = competitorData.summary;
    document.getElementById('competitor-text').innerHTML = competitorData.breakdownText;
    
    createCompetitorChart(competitorData.breakdown);

    const table = document.getElementById('competitor-table');
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr><th>Competitor</th><th>Type</th><th>Nature of Threat</th><th class="text-center">Threat Level</th></tr>`;
    
    const tbody = document.createElement('tbody');
    competitorData.competitors.forEach(comp => {
        const row = document.createElement('tr');
        const threatClass = comp.threatLevel.toLowerCase() === 'high' ? 'threat-high' : 'threat-medium';
        row.innerHTML = `
            <td class="font-semibold text-white">${comp.name}</td>
            <td>${comp.type}</td>
            <td class="text-gray-400 max-w-sm">${comp.threat}</td>
            <td class="text-center"><span class="${threatClass}">${comp.threatLevel}</span></td>
        `;
        tbody.appendChild(row);
    });

    table.append(thead, tbody);
}

function populateOnPageAnalysis() {
    const container = document.getElementById('on-page-cards');
    onPageAnalysisData.forEach(item => {
        const card = document.createElement('div');
        card.className = `card border-l-4 ${item.isPositive ? 'border-green-500' : 'border-red-500'}`;
        card.innerHTML = `
            <h3 class="font-bold text-lg text-white mb-2 flex items-center gap-2">
                <i data-lucide="${item.icon}" class="${item.isPositive ? 'text-green-400' : 'text-red-400'}"></i>
                ${item.title}
            </h3>
            <p class="text-gray-400">${item.description}</p>
        `;
        container.appendChild(card);
    });
}

function populateTechnicalAudit() {
    const container = document.getElementById('technical-audit-content');
    technicalAuditData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-gray-800/50 p-4 rounded-lg';
        div.innerHTML = `
            <h4 class="font-semibold text-white mb-2 flex items-center gap-2">
                <i data-lucide="${item.icon}" class="${item.colorClass}"></i>
                ${item.title}
            </h4>
            <div class="prose prose-sm prose-invert max-w-none text-gray-400">${item.details}</div>
        `;
        container.appendChild(div);
    });
}

function populateOffPageAnalysis() {
    const container = document.getElementById('off-page-cards');
    offPageAnalysisData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card border-l-4 border-amber-500';
        card.innerHTML = `
            <h3 class="font-bold text-lg text-white mb-2 flex items-center gap-2">
                <i data-lucide="${item.icon}" class="text-amber-400"></i>
                ${item.title}
            </h3>
            <p class="text-gray-400">${item.description}</p>
        `;
        container.appendChild(card);
    });
}

function populateRecommendations() {
    const container = document.getElementById('recommendations-list');
    recommendationsData.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <div class="recommendation-priority p${rec.priority}">
                <span class="priority-number">${rec.priority}</span>
                <span class="priority-label">Priority</span>
            </div>
            <div>
                <h3 class="text-xl font-bold text-white mb-2">${rec.title}</h3>
                <p class="text-gray-400 mb-3">${rec.justification}</p>
                <div class="flex flex-wrap gap-2">
                    ${rec.tags.map(tag => `<span class="bg-gray-700 text-cyan-300 text-xs font-semibold px-2 py-1 rounded-full">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}


function populateConclusion() {
    const p = document.querySelector('#conclusion .card p');
    p.innerHTML = conclusionData;
}
