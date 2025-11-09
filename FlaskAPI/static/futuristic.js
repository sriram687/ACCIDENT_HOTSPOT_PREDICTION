// ===================================
// SafeRoute AI - Futuristic JavaScript
// ===================================

// Initialize Particles.js
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#A855F7'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#0EA5E9',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Smooth Scroll
function scrollToRiskScan() {
    document.getElementById('risk-scan')?.scrollIntoView({
        behavior: 'smooth'
    });
}

// AI Assistant Hints Rotation
const aiHints = [
    '⚡ Analyzing traffic patterns in real-time...',
    '🌧️ Weather conditions monitored across 24 zones',
    '📊 Processing 204,816 historical data points',
    '🚨 3 high-risk zones detected in your area',
    '🤖 ML model accuracy: 92% and improving',
    '🗺️ Geographic clustering active for 15 hotspots',
    '⏰ Peak accident time: 5-7 PM weekdays',
    '🌙 Night driving risk 35% higher than daytime'
];

let currentHintIndex = 0;
const aiHintElement = document.getElementById('ai-hint');

function rotateAIHints() {
    if (aiHintElement) {
        currentHintIndex = (currentHintIndex + 1) % aiHints.length;
        aiHintElement.style.opacity = '0';
        
        setTimeout(() => {
            aiHintElement.textContent = aiHints[currentHintIndex];
            aiHintElement.style.opacity = '1';
        }, 300);
    }
}

// Rotate hints every 5 seconds
if (aiHintElement) {
    aiHintElement.style.transition = 'opacity 0.3s ease';
    setInterval(rotateAIHints, 5000);
}

// Form Enhancement
const riskForm = document.getElementById('riskForm');
if (riskForm) {
    // Set default date to now
    const dateInput = riskForm.querySelector('input[name="date"]');
    if (dateInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateInput.value = now.toISOString().slice(0, 16);
    }
    
    // Form submission with loading state
    riskForm.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="ph ph-circle-notch"></i> Analyzing...';
            submitBtn.style.pointerEvents = 'none';
            
            // Animate gauge during submission
            animateGauge(Math.random() * 100);
        }
    });
    
    // Real-time input validation feedback
    const inputs = riskForm.querySelectorAll('.cyber-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = 'rgba(168, 85, 247, 0.5)';
            } else {
                this.style.borderColor = '';
            }
        });
    });
}

// Risk Gauge Animation
function animateGauge(score) {
    const gaugeProgress = document.getElementById('gaugeProgress');
    const riskScore = document.getElementById('riskScore');
    
    if (gaugeProgress && riskScore) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (score / 100) * circumference;
        
        gaugeProgress.style.strokeDashoffset = offset;
        
        // Animate number
        let current = 0;
        const increment = score / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                current = score;
                clearInterval(timer);
            }
            riskScore.textContent = Math.floor(current);
        }, 20);
        
        // Update color based on risk level
        if (score < 30) {
            gaugeProgress.style.stroke = '#10B981';
            updateSuggestions('safe');
        } else if (score < 70) {
            gaugeProgress.style.stroke = '#F97316';
            updateSuggestions('moderate');
        } else {
            gaugeProgress.style.stroke = '#EF4444';
            updateSuggestions('high');
        }
    }
}

// Update AI Suggestions
function updateSuggestions(riskLevel) {
    const suggestionsList = document.getElementById('suggestions-list');
    if (!suggestionsList) return;
    
    const suggestions = {
        safe: [
            { icon: 'check-circle', text: 'Route conditions are optimal for safe driving' },
            { icon: 'sun', text: 'Good visibility and weather conditions' },
            { icon: 'road-horizon', text: 'No significant road hazards detected' }
        ],
        moderate: [
            { icon: 'warning', text: 'Exercise caution: Moderate risk conditions' },
            { icon: 'speedometer', text: 'Reduce speed by 10-15 mph' },
            { icon: 'headlights', text: 'Ensure headlights are on and functional' }
        ],
        high: [
            { icon: 'warning-circle', text: 'High risk detected: Consider alternate route' },
            { icon: 'clock', text: 'Delay travel if possible' },
            { icon: 'phone', text: 'Stay alert and avoid distractions' },
            { icon: 'shield-warning', text: 'Emergency services notified of hazard' }
        ]
    };
    
    const items = suggestions[riskLevel] || suggestions.safe;
    suggestionsList.innerHTML = items.map(item => `
        <div class="suggestion-item">
            <i class="ph ph-${item.icon}"></i>
            <span>${item.text}</span>
        </div>
    `).join('');
}

// Copy API Code
function copyCode() {
    const code = document.getElementById('apiCode');
    if (code) {
        const text = code.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Code copied to clipboard!');
        });
    }
}

// Mobile Menu Toggle (if needed)
const navToggle = document.createElement('button');
navToggle.className = 'nav-toggle';
navToggle.innerHTML = '<i class="ph ph-list"></i>';
navToggle.style.display = 'none';

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and other elements
document.querySelectorAll('.feature-card, .chart-card, .stat-card-dash').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top-btn glass-effect';
scrollTopBtn.innerHTML = '<i class="ph ph-arrow-up"></i>';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 8rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid var(--glass-border);
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999;
    transition: all 0.3s ease;
`;

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

// Initialize gauge with default state
if (document.getElementById('gaugeProgress')) {
    const svg = document.querySelector('.gauge-circle svg');
    if (svg) {
        // Add gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gaugeGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#A855F7;stop-opacity:1');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#0EA5E9;stop-opacity:1');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
    }
}

// Typewriter effect for hero title (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 1rem;">Processing...</p>
    `;
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(11, 15, 26, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    document.body.appendChild(loading);
    return loading;
}

// Console easter egg
console.log('%c⚡ SafeRoute AI', 'color: #A855F7; font-size: 24px; font-weight: bold;');
console.log('%cMaking Roads Smarter 🚗', 'color: #0EA5E9; font-size: 14px;');
console.log('%cPowered by XGBoost ML | 92% Accuracy', 'color: #10B981; font-size: 12px;');

// Export functions for use in other scripts
window.SafeRouteAI = {
    scrollToRiskScan,
    animateGauge,
    updateSuggestions,
    copyCode,
    showLoading
};
