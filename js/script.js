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

        // Form submission
        const contactForm = document.getElementById('contactForm');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Obrigada por entrar em contato! Retornaremos em breve.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });

        // Replace phone numbers with actual number
        document.addEventListener('DOMContentLoaded', function () {
            const phoneNumber = '5547997882504';

            // Update all WhatsApp links
            const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
            whatsappLinks.forEach(link => {
                const serviceText = link.closest('.service-card') ?
                    link.closest('.service-card').querySelector('h3').textContent :
                    'serviço';
                link.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Olá! Gostaria de agendar um ${serviceText}.`)}`;
            });

            // Update phone number in contact section
            const phoneElement = document.querySelector('.contact-details p');
            if (phoneElement && phoneElement.textContent.includes('(47) 99788-2504')) {
                const formattedPhone = `(${phoneNumber.substring(2, 4)}) ${phoneNumber.substring(4, 9)}-${phoneNumber.substring(9)}`;
                phoneElement.textContent = formattedPhone;
            }
        });

        // Add subtle animations to elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.service-card, .technique-card, .about-img, .about-text, .contact-form, .contact-info').forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });