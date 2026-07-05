import { resumeData } from './data/resume.js';

const d = resumeData;
let activeSection = 'overview';

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="overlay" id="overlay"></div>
    ${renderSidebar()}
    <div class="main">
      ${renderHeader()}
      <div class="content">
        ${renderMetrics()}
        <div class="section active" id="sec-overview">${renderOverview()}</div>
        <div class="section" id="sec-experience">${renderExperience()}</div>
        <div class="section" id="sec-skills">${renderSkills()}</div>
        <div class="section" id="sec-projects">${renderProjects()}</div>
        <div class="section" id="sec-education">${renderEducation()}</div>
        <div class="section" id="sec-contact">${renderContact()}</div>
      </div>
    </div>
  `;
  bindEvents();
  initCharts();
  animateSkillBars();
}

function renderSidebar() {
  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'experience', icon: '💼', label: 'Experience' },
    { id: 'skills', icon: '🛠', label: 'Skills' },
    { id: 'projects', icon: '🚀', label: 'Projects' },
    { id: 'education', icon: '🎓', label: 'Education' },
    { id: 'contact', icon: '📬', label: 'Contact' },
  ];

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-avatar">${d.name.split(' ').map(n => n[0]).join('')}</div>
        <div class="sidebar-name">${d.name}</div>
        <div class="sidebar-role">${d.title}</div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">Navigation</div>
        ${navItems.map(item => `
          <div class="nav-item ${activeSection === item.id ? 'active' : ''}" data-section="${item.id}">
            <span class="nav-icon">${item.icon}</span>
            ${item.label}
          </div>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <span class="status-dot"></span>
        Available for opportunities
      </div>
    </aside>
  `;
}

function renderHeader() {
  return `
    <header class="header">
      <button class="hamburger" id="hamburger">☰</button>
      <div class="header-title">portfolio<span>.sh</span> ~/<span id="current-section">${activeSection}</span></div>
      <div class="header-actions">
        <a href="mailto:${d.email}" style="text-decoration:none">
          <button style="padding:6px 16px;background:var(--gradient1);border:none;border-radius:6px;color:#080c18;cursor:pointer;font-size:12px;font-family:var(--font-mono);font-weight:600">
            ✉ Contact
          </button>
        </a>
      </div>
    </header>
  `;
}

function renderMetrics() {
  return `
    <div class="hero">
      <h1>Hi, I'm <span class="gradient">${d.name}</span></h1>
      <p class="tagline">${d.tagline}</p>
    </div>
    <div class="metrics-grid">
      ${d.metrics.map(m => `
        <div class="metric-card">
          <div class="metric-value" data-count="${m.value}">${m.value}</div>
          <div class="metric-label">${m.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderOverview() {
  return `
    <div class="section-header">
      <div class="section-icon">📊</div>
      <h2 class="section-title">Dashboard</h2>
    </div>
    <div class="chart-grid">
      <div class="chart-container">
        <div class="chart-title">Skills Proficiency</div>
        <div class="chart-wrapper"><canvas id="skillsBarChart"></canvas></div>
      </div>
      <div class="chart-container">
        <div class="chart-title">Career Timeline</div>
        <div class="chart-wrapper"><canvas id="timelineChart"></canvas></div>
      </div>
    </div>
    <div class="radar-section">
      <div class="chart-container">
        <div class="chart-title">Skill Distribution by Category</div>
        <div class="chart-wrapper"><canvas id="radarChart"></canvas></div>
      </div>
      <div class="chart-container">
        <div class="chart-title">Experience by Domain</div>
        <div class="chart-wrapper"><canvas id="doughnutChart"></canvas></div>
      </div>
    </div>
    <div class="exp-card" style="border-left: 3px solid var(--accent)">
      <p style="color:var(--text-secondary);font-size:15px;line-height:1.8">${d.summary}</p>
    </div>
  `;
}

function renderExperience() {
  return `
    <div class="section-header">
      <div class="section-icon">💼</div>
      <h2 class="section-title">Experience</h2>
    </div>
    ${d.experience.map(exp => `
      <div class="exp-card">
        <div class="exp-card-header">
          <div>
            <div class="exp-role">${exp.role}</div>
            <div class="exp-company">${exp.company}</div>
          </div>
          <div class="exp-meta">
            ${exp.period}<br>${exp.location}
          </div>
        </div>
        <ul class="exp-achievements">
          ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
        </ul>
        <div class="exp-tech">
          ${exp.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

function renderSkills() {
  const allSkills = Object.entries(d.skills);
  return `
    <div class="section-header">
      <div class="section-icon">🛠</div>
      <h2 class="section-title">Skills</h2>
    </div>
    <div class="skills-grid">
      ${allSkills.map(([group, skills]) => `
        <div class="skill-group">
          <div class="skill-group-title">${group}</div>
          ${skills.map(s => `
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${s.name}</span>
                <span class="skill-level">${s.level}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-fill" data-level="${s.level}"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function renderProjects() {
  const allTech = [...new Set(d.projects.flatMap(p => p.tech))];
  return `
    <div class="section-header">
      <div class="section-icon">🚀</div>
      <h2 class="section-title">Projects</h2>
    </div>
    <div class="project-filters">
      <button class="filter-btn active" data-filter="all">All</button>
      ${allTech.map(t => `<button class="filter-btn" data-filter="${t}">${t}</button>`).join('')}
    </div>
    <div class="projects-grid" id="projects-grid">
      ${d.projects.map((p, i) => `
        <div class="project-card" data-tech="${p.tech.join(',')}">
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.description}</div>
          <div class="project-impact">Impact: ${p.impact}</div>
          <div class="exp-tech">
            ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderEducation() {
  return `
    <div class="section-header">
      <div class="section-icon">🎓</div>
      <h2 class="section-title">Education & Certifications</h2>
    </div>
    <div class="edu-timeline">
      ${d.education.map(e => `
        <div class="edu-item">
          <div class="edu-degree">${e.degree}</div>
          <div class="edu-school">${e.school}</div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:32px">
      <h3 style="font-size:18px;margin-bottom:16px;color:var(--text-secondary)">Certifications</h3>
      <div class="certs-list">
        ${d.certifications.map(c => `
          <div class="cert-item">
            <span class="cert-icon">🏅</span>
            ${c}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderContact() {
  return `
    <div class="section-header">
      <div class="section-icon">📬</div>
      <h2 class="section-title">Get in Touch</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-card" onclick="window.open('mailto:${d.email}')">
        <div class="contact-icon">✉️</div>
        <div class="contact-label">Email</div>
        <div class="contact-value">${d.email}</div>
      </div>
      <div class="contact-card" onclick="window.open('https://${d.linkedin}', '_blank')">
        <div class="contact-icon">🔗</div>
        <div class="contact-label">LinkedIn</div>
        <div class="contact-value">${d.linkedin}</div>
      </div>
      <div class="contact-card" onclick="navigator.clipboard.writeText('${d.phone}')">
        <div class="contact-icon">📞</div>
        <div class="contact-label">Phone</div>
        <div class="contact-value">${d.phone}</div>
      </div>
      <div class="contact-card">
        <div class="contact-icon">📍</div>
        <div class="contact-label">Location</div>
        <div class="contact-value">${d.location}</div>
      </div>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      activeSection = item.dataset.section;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById(`sec-${activeSection}`).classList.add('active');
      document.getElementById('current-section').textContent = activeSection;
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('overlay').classList.remove('active');
      if (activeSection === 'overview') {
        initCharts();
      }
      if (activeSection === 'skills') {
        setTimeout(animateSkillBars, 100);
      }
    });
  });

  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('overlay').classList.toggle('active');
    });
  }

  document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          const techs = card.dataset.tech.split(',');
          card.style.display = techs.includes(filter) ? 'block' : 'none';
        }
      });
    });
  });
}

function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach((bar, i) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.level + '%';
    }, i * 60);
  });
}

async function initCharts() {
  const ChartJS = await import('chart.js');
  const { Chart } = ChartJS;
  Chart.register(
    ChartJS.TimeScale, ChartJS.LinearScale, ChartJS.CategoryScale,
    ChartJS.BarController, ChartJS.ScatterController, ChartJS.RadarController, ChartJS.DoughnutController,
    ChartJS.BarElement, ChartJS.PointElement, ChartJS.LineElement, ChartJS.RadialLinearScale,
    ChartJS.Filler, ChartJS.Tooltip, ChartJS.Legend
  );

  const goldColors = ['#d4a857', '#e8b84b', '#c59b3c', '#f0c05d', '#b8892e', '#2dd4bf', '#f59e0b'];

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#121b30',
        titleColor: '#e8ecf4',
        bodyColor: '#8899b6',
        borderColor: '#1e2d4a',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: { ticks: { color: '#4f6385', font: { family: 'JetBrains Mono', size: 11 } }, grid: { color: 'rgba(30,45,74,0.3)' } },
      y: { ticks: { color: '#4f6385', font: { family: 'JetBrains Mono', size: 11 } }, grid: { color: 'rgba(30,45,74,0.3)' } }
    }
  };

  const colors = goldColors;

  // Skills bar chart
  const skillsBar = document.getElementById('skillsBarChart');
  if (skillsBar) {
    if (skillsBar._chart) skillsBar._chart.destroy();
    const allSkills = Object.values(d.skills).flat().slice(0, 10);
    skillsBar._chart = new Chart(skillsBar, {
      type: 'bar',
      data: {
        labels: allSkills.map(s => s.name.length > 20 ? s.name.substring(0, 20) + '...' : s.name),
        datasets: [{
          data: allSkills.map(s => s.level),
          backgroundColor: colors.map(c => c + '99'),
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        ...baseOpts,
        indexAxis: 'y',
        scales: {
          x: { ...baseOpts.scales.x, max: 100 },
          y: { ...baseOpts.scales.y, ticks: { ...baseOpts.scales.y.ticks, font: { family: 'Space Grotesk', size: 11 } } }
        }
      }
    });
  }

  // Timeline chart
  const timeline = document.getElementById('timelineChart');
  if (timeline) {
    if (timeline._chart) timeline._chart.destroy();
    const events = [
      { label: '2018 - CA Practice', y: 0 },
      { label: '2021 - Head Finance', y: 1 },
      { label: '2022 - KPMG', y: 0 },
      { label: '2024 - PwC', y: 1 },
    ];
    timeline._chart = new Chart(timeline, {
      type: 'scatter',
      data: {
        datasets: [{
          data: events.map((e, i) => ({ x: i, y: e.y })),
          backgroundColor: '#d4a857',
          borderColor: '#d4a857',
          pointRadius: 10,
          pointHoverRadius: 14,
          pointStyle: 'circle',
          showLine: true,
          borderWidth: 2,
          tension: 0.1
        }]
      },
      options: {
        ...baseOpts,
        plugins: {
          ...baseOpts.plugins,
          legend: { display: false },
          tooltip: {
            ...baseOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => events[ctx.dataIndex].label
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: -0.3,
            max: 3.3,
            ticks: {
              color: '#4f6385',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (val) => events[val]?.label?.split(' - ')[0] || ''
            },
            grid: { color: 'rgba(30,45,74,0.3)' }
          },
          y: { display: false, min: -0.5, max: 1.5 }
        }
      }
    });
  }

  // Radar chart
  const radar = document.getElementById('radarChart');
  if (radar) {
    if (radar._chart) radar._chart.destroy();
    const cats = Object.keys(d.skills);
    const avgs = cats.map(cat => {
      const skills = d.skills[cat];
      return Math.round(skills.reduce((a, b) => a + b.level, 0) / skills.length);
    });
    radar._chart = new Chart(radar, {
      type: 'radar',
      data: {
        labels: cats,
        datasets: [{
          data: avgs,
          backgroundColor: 'rgba(212, 168, 87, 0.15)',
          borderColor: '#d4a857',
          borderWidth: 2,
          pointBackgroundColor: '#d4a857',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: 'rgba(30,45,74,0.3)' },
            grid: { color: 'rgba(30,45,74,0.3)' },
            pointLabels: { color: '#8899b6', font: { family: 'Space Grotesk', size: 12 } },
            ticks: { display: false },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }

  // Doughnut chart
  const doughnut = document.getElementById('doughnutChart');
  if (doughnut) {
    if (doughnut._chart) doughnut._chart.destroy();
    doughnut._chart = new Chart(doughnut, {
      type: 'doughnut',
      data: {
        labels: ['P2P / O2C / R2R', 'SSC Setup', 'Process Automation', 'FP&A & Budgeting', 'MIS & Dashboards'],
        datasets: [{
          data: [25, 20, 20, 20, 15],
          backgroundColor: ['#d4a857', '#e8b84b', '#c59b3c', '#f0c05d', '#2dd4bf'],
          borderColor: '#080c18',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#8899b6', font: { family: 'Space Grotesk', size: 12 }, padding: 16 }
          }
        }
      }
    });
  }
}

render();
