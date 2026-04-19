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
        
        // Chatbot intelligence based on DOM reading
        const textLow = text.toLowerCase();
        let response = "I'm not sure about that. Try asking me about Kenasa's skills, programming languages, projects, or contact info!";
        
        // Extract site context on the fly
        if(textLow.includes('skill') || textLow.includes('language') || textLow.includes('stack')) {
            const skillNodes = document.querySelectorAll('.skill-info span:first-child');
            const toolNodes = document.querySelectorAll('.tool span');
            
            const skills = Array.from(skillNodes).map(n => n.innerText).join(', ');
            const tools = Array.from(toolNodes).map(n => n.innerText).join(', ');
            response = `Kenasa's technical skills encompass: ${skills}. His platforms and tools include: ${tools}.`;
        } else if(textLow.includes('project') || textLow.includes('work')) {
            const projectNodes = document.querySelectorAll('.project-title');
            const projects = Array.from(projectNodes).map(n => n.innerText).join(' and ');
            response = `Kenasa has built several impressive projects, including: ${projects}. You can view the source code in the Featured Projects section.`;
        } else if(textLow.includes('contact') || textLow.includes('email') || textLow.includes('reach') || textLow.includes('hire') || textLow.includes('touch')) {
            const emailNode = document.querySelector('a[href^="mailto:"]');
            const email = emailNode ? emailNode.innerText : "kenasafayera1@gmail.com";
            response = `You can get in touch with Kenasa directly via email at ${email}, or using the Social Media options at the top of the page.`;
        } else if(textLow.includes('who is') || textLow.includes('about') || textLow.includes('bio') || textLow.includes('student')) {
            const bioNode = document.querySelector('.bio');
            const bio = bioNode ? bioNode.innerText.replace(/"/g, '') : "He is a student and developer.";
            response = bio;
        } else if(textLow.includes('hi') || textLow.includes('hello') || textLow.includes('hey') || textLow.includes('greet')) {
            response = "Hello there! I'm Kenasa's intelligent assistant. I can answer questions about his skills, background, projects, and how to contact him. What would you like to know?";
        } else {
            response = "Interesting question! Feel free to explore the portfolio sections directly to uncover more about Kenasa.";
        }
        
        botDiv.innerText = response;
        
        chatMsgs.appendChild(botDiv);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }, 800);
}

sendMsgBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') handleSendMessage();
});

// Removed contact form behavior

// ==== SOCIAL MEDIA DROPDOWN INTERACTION ====
const socialBtn = document.querySelector('.dropbtn');
const socialContent = document.querySelector('.dropdown-content');

if (socialBtn && socialContent) {
    socialBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        socialContent.classList.toggle('show');
    });

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', (e) => {
        if (!socialBtn.contains(e.target) && !socialContent.contains(e.target)) {
            socialContent.classList.remove('show');
        }
    });

    // Ensure link clicks inside dropdown respond instantly without default anchor delay 
    const socialLinks = socialContent.querySelectorAll('a');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Let the link open normally but remove the show class instantly for polished UI
            socialContent.classList.remove('show');
        });
    });
}
