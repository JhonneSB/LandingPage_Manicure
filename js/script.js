// Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') ?
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Close mobile menu when clicking on a link
const navItems = document.querySelectorAll('.nav-links a');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Testimonial form submission
const testimonialForm = document.getElementById('testimonialForm');
const testimonialsGrid = document.getElementById('testimonialsGrid');

// Load testimonials from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadTestimonials();

    // Initialize animations
    initAnimations();
});

testimonialForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = testimonialForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // Get form values
    const name = document.getElementById('clientName').value;
    const service = document.getElementById('clientService').value;
    const rating = document.querySelector('input[name="rating"]:checked');

    if (!rating) {
        showNotification('Por favor, selecione uma avaliação com estrelas.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    const ratingValue = parseInt(rating.value);
    const testimonial = document.getElementById('clientTestimonial').value;

    // Create testimonial object
    const newTestimonial = {
        id: Date.now(),
        name,
        service,
        rating: ratingValue,
        testimonial,
        date: new Date().toLocaleDateString('pt-BR')
    };

    // Save to localStorage
    saveTestimonial(newTestimonial);

    // Add to grid
    addTestimonialToGrid(newTestimonial);

    // Reset form
    testimonialForm.reset();

    // Reset stars
    document.querySelectorAll('input[name="rating"]').forEach(star => {
        star.checked = false;
    });

    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message
        showNotification('Depoimento enviado com sucesso! Obrigada por compartilhar sua experiência.', 'success');
    }, 1000);
});

function saveTestimonial(testimonial) {
    let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    testimonials.unshift(testimonial); // Add to beginning of array

    // Keep only last 20 testimonials
    if (testimonials.length > 20) {
        testimonials = testimonials.slice(0, 20);
    }

    localStorage.setItem('testimonials', JSON.stringify(testimonials));
}

function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];

    // Add sample testimonials if none exist
    if (testimonials.length === 0) {
        const sampleTestimonials = [
            {
                id: 1,
                name: "Maria Silva",
                service: "Manicure Tradicional",
                rating: 5,
                testimonial: "Adorei o atendimento! As unhas ficaram perfeitas e o ambiente é muito aconchegante. A Lê é muito atenciosa e caprichosa.",
                date: "27/09/2025"
            },
    
        ];

        sampleTestimonials.forEach(testimonial => {
            saveTestimonial(testimonial);
        });

        // Reload with sample data
        loadTestimonials();
        return;
    }

    testimonials.forEach(testimonial => {
        addTestimonialToGrid(testimonial);
    });
}

function addTestimonialToGrid(testimonial) {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card';
    testimonialCard.innerHTML = `
        <div class="testimonial-header">
            <div class="client-name">${escapeHtml(testimonial.name)}</div>
            <div class="client-service">${escapeHtml(testimonial.service)}</div>
        </div>
        <div class="testimonial-rating">
            ${getStarRating(testimonial.rating)}
        </div>
        <div class="testimonial-text">"${escapeHtml(testimonial.testimonial)}"</div>
        <div class="testimonial-date">${escapeHtml(testimonial.date)}</div>
    `;

    testimonialsGrid.appendChild(testimonialCard);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #f44336, #d32f2f)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-primary);
    `;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="font-size: 20px;"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize animations
function initAnimations() {
    // Add subtle animations to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Add staggered animation for grid items
                if (entry.target.classList.contains('service-card') ||
                    entry.target.classList.contains('technique-card') ||
                    entry.target.classList.contains('testimonial-card')) {
                    const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .technique-card, .about-image, .about-text, .testimonial-card, .contact-info, .contact-map'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Hero text animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(40px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-12px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    }
});

// Fix for menu toggle display
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

