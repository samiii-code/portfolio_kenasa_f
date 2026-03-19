// ==== INDIVIDUAL CURSOR FOLLOWING ON WHOLE BODY ====
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Cursor size manipulation on clickable elements
const interactables = document.querySelectorAll('a, button, .tool, .project-card, input, textarea');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '150px';
        cursorGlow.style.height = '150px';
        cursorGlow.style.transition = 'width 0.2s, height 0.2s';
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '300px';
        cursorGlow.style.height = '300px';
    });
});

// ==== THEME SWITCHER ====
const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        themeBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        // Apply theme
        const theme = btn.getAttribute('data-theme');
        document.body.setAttribute('data-theme', theme);
        
        // Update particles color based on theme
        updateParticleColors(theme);
    });
});

// ==== SKILL BARS ANIMATION ON SCROLL ====
const skillSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.progress');
let skillsAnimated = false;

window.addEventListener('scroll', () => {
    if(skillsAnimated) return;
    
    // Animate when the skills section is visible
    const sectionPos = skillSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;
    
    if(sectionPos < screenPos) {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
        skillsAnimated = true;
    }
});

// ==== PARTICLES BACKGROUND ====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let particleColor = '#00ffff';

function updateParticleColors(theme) {
    if(theme === 'dark') particleColor = '#00ffff';
    else if(theme === 'light') particleColor = '#2563eb';
    else if(theme === 'blue') particleColor = '#38bdf8';
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around the edges
        if(this.x > canvas.width) this.x = 0;
        if(this.x < 0) this.x = canvas.width;
        if(this.y > canvas.height) this.y = 0;
        if(this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = particleColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    }
}

function initParticles() {
    particlesArray = [];
    const particleCount = window.innerWidth < 800 ? 50 : 120; // Number of particles depending on device width
    for(let i=0; i<particleCount; i++){
        particlesArray.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    // Clear canvas trace slightly to make trails
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<particlesArray.length; i++){
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// ==== CHATBOT INTERACTION ====
const chatbotTrigger = document.querySelector('.chatbot-trigger');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendMsgBtn = document.getElementById('sendMessage');
const chatMsgs = document.getElementById('chatMsgs');

chatbotTrigger.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

function handleSendMessage() {
    const text = chatInput.value.trim();
    if(text === '') return;
    
    // Add user message to UI
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-msg');
    userDiv.innerText = text;
    chatMsgs.appendChild(userDiv);
    
    chatInput.value = '';
    
    // Scroll to bottom
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    
    // Simulate generic bot response
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.classList.add('bot-msg');
        
        // Simple contextual response system
        const textLow = text.toLowerCase();
        if(textLow.includes('skills') || textLow.includes('stack')) {
            botDiv.innerText = "Kenasa excels in HTML, CSS, JavaScript, Python, Java, SQL, GitHub, and Linux.";
        } else if(textLow.includes('projects') || textLow.includes('work')) {
            botDiv.innerText = "He has built a Java Servlet-based Registration App and a MEAN Stack School Management System.";
        } else if(textLow.includes('contact') || textLow.includes('email') || textLow.includes('reach')) {
            botDiv.innerText = "You can reach him rapidly at kenasafayera1@gmail.com";
        } else {
            botDiv.innerText = "Interesting parameter! Feel free to explore the portfolio sections to uncover more about Kenasa.";
        }
        
        chatMsgs.appendChild(botDiv);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }, 800);
}

sendMsgBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') handleSendMessage();
});

// ==== CONTACT FORM BEHAVIOR ====
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.innerHTML;
    // Visually denote transmission
    btn.innerHTML = 'Transmitting...';
    setTimeout(() => {
        btn.innerHTML = 'Data Sent!';
        form.reset(); // clear inputs
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }, 1500);
});
