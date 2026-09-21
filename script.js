// ========================================
// MD Thasin Zaman - Portfolio
// 100% Error-Free & Advanced JavaScript
// ========================================

// 1. Audio Context Setup (Fixes browser autoplay blocking)
let audioCtx;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}
// Initialize audio on first user interaction
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

// Sound Manager
const soundManager = {
    enabled: true,
    playTone: function(frequency, type, duration, volume) {
        if (!this.enabled || !audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + duration);
    },
    playClick: function() { this.playTone(800, 'sine', 0.1, 0.1); },
    playHover: function() { this.playTone(600, 'sine', 0.05, 0.05); },
    playSuccess: function() {
        this.playTone(523.25, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.15), 100);
        setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.2), 200);
    },
    toggle: function() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

// Sound Toggle Button
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
soundToggle.addEventListener('click', () => {
    const isEnabled = soundManager.toggle();
    soundIcon.className = isEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    soundToggle.style.background = isEnabled ? 'var(--gradient)' : 'var(--gray)';
    soundManager.playClick();
});

// 2. Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        soundManager.playSuccess();
    }, 1500);
});

// 3. Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// 4. Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// 5. Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    soundManager.playClick();
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        soundManager.playClick();
    });
});

// 6. Active Nav Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// 7. Typing Animation
const typingTexts = ['Student', 'Content Creator', 'Physics Teacher', 'Chemistry Expert', 'Founder of ThasinVerse'];
let textIndex = 0, charIndex = 0, isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeText() {
    const currentText = typingTexts[textIndex];
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }
    setTimeout(typeText, typeSpeed);
}
typeText();

// 8. Counter & Skill Animation (Intersection Observer)
let countersStarted = false, skillsAnimated = false;
const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Counter Animation
            if (entry.target.classList.contains('stats-grid') && !countersStarted) {
                countersStarted = true;
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.parentElement.getAttribute('data-count'));
                    let current = 0;
                    const increment = target / 100;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.textContent = Math.ceil(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target + '+';
                            soundManager.playSuccess();
                        }
                    };
                    updateCounter();
                });
            }

            // Skill Bar Animation
            if (entry.target.classList.contains('skills') && !skillsAnimated) {
                skillsAnimated = true;
                document.querySelectorAll('.skill-fill').forEach((fill, index) => {
                    setTimeout(() => {
                        fill.style.width = fill.getAttribute('data-width') + '%';
                        soundManager.playHover();
                    }, index * 150);
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll, .stats-grid, .skills, .timeline-item, .project-card, .skill-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// 9. Project Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        soundManager.playClick();

        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

// 10. Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const mailtoLink = `mailto:thasinzaman21@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    window.location.href = mailtoLink;
    soundManager.playSuccess();
    setTimeout(() => alert('✅ Thank you! Your email client will open now.'), 300);
    e.target.reset();
});

// 11. Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundManager.playClick();
});

// 12. Particle Background System
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 40; i++) particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// 13. Smooth Scroll & Hover Sounds
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            soundManager.playClick();
        }
    });
});

document.querySelectorAll('.btn, .social-link, .project-link, .skill-card, .stat-card, .filter-btn, .contact-item, .footer-links a, .footer-social-links a').forEach(el => {
    el.addEventListener('mouseenter', () => soundManager.playHover());
});