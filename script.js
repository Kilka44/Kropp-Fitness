class PausableImageMarquee {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.content = this.container.querySelector('.marquee-content');
        this.speed = options.speed || 2;
        this.direction = options.direction || 'left';
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        this.duplicateContent();        
        this.setupStyles();        
        this.setupEventListeners();        
        this.animate();
    }
    
    duplicateContent() {
        const clone = this.content.cloneNode(true);
        this.content.appendChild(clone);
    }
    
    setupStyles() {
        this.content.style.display = 'flex';
        this.content.style.gap = '26px';
        this.content.style.width = 'max-content';
    }
    
    setupEventListeners() {
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.resume());
        
        this.container.addEventListener('touchstart', () => this.pause());
        this.container.addEventListener('touchend', () => this.resume());
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    animate() {
        let position = 0;
        const contentWidth = this.content.scrollWidth / 2;
        
        const animateFrame = () => {
            if (!this.isPaused) {
                if (this.direction === 'left') {
                    position -= this.speed;
                    if (Math.abs(position) >= contentWidth) {
                        position = 0;
                    }
                } else {
                    position += this.speed;
                    if (position >= 0) {
                        position = -contentWidth;
                    }
                }
                
                this.content.style.transform = `translateX(${position}px)`;
            }
            
            requestAnimationFrame(animateFrame);
        };
        
        animateFrame();
    }
    
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }
    
    setDirection(newDirection) {
        this.direction = newDirection;
    }
    
    addImage(src, alt, width = 414, height = 479) {
        const img = document.createElement('img');
        img.className = 'family-image';
        img.src = src;
        img.alt = alt;
        img.width = width;
        img.height = height;
        img.loading = 'lazy';
        
        this.content.appendChild(img);
        this.content.innerHTML = '';
        this.duplicateContent();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const marquee = new PausableImageMarquee('marqueeContainer', {
        speed: 1,
        direction: 'left'
    });   
    window.marquee = marquee;
   addControlButtons(marquee);
});


function addControlButtons(marquee) {
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 1000;
    `;
}

// calculate

document.getElementById('bmiForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const activityFactor = parseFloat(document.getElementById('activity-factor').value);
  
  if (!height || !weight || !age || !gender || !activityFactor) {
    alert('Please fill in all fields');
    return;
  }
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters); 
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  const tdee = bmr * activityFactor;
  
  let status;
  let statusClass;
  if (bmi < 18.5) {
    status = 'Underweight';
    statusClass = 'underweight';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    status = 'Healthy';
    statusClass = 'healthy';
  } else if (bmi >= 25 && bmi <= 29.9) {
    status = 'Overweight';
    statusClass = 'overweight';
  } else {
    status = 'Obese';
    statusClass = 'obese';
  }
  
  document.getElementById('bmiResult').textContent = `BMI: ${bmi.toFixed(1)} (${status})`;
  document.getElementById('bmrResult').textContent = `BMR: ${bmr.toFixed(0)} calories/day`;
  document.getElementById('statusResult').textContent = `Daily Calorie Needs: ${tdee.toFixed(0)} calories/day`;
  
  const resultDiv = document.getElementById('result');
  resultDiv.className = 'calculate-result ' + statusClass;
  resultDiv.style.display = 'block';
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});