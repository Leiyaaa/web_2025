class ImageSlider {
    constructor(sliderSelector = '.slider-container') {
        // Elements
        this.slider = document.querySelector(sliderSelector);
        this.slidesContainer = this.slider.querySelector('.slides');
        this.slides = this.slider.querySelectorAll('.slide');
        this.prevBtn = this.slider.querySelector('.prev');
        this.nextBtn = this.slider.querySelector('.next');
        this.dotsContainer = this.slider.querySelector('.dots');
        this.counter = this.slider.querySelector('.counter');
        this.currentCounter = this.slider.querySelector('.current');
        this.totalCounter = this.slider.querySelector('.total');
        this.autoplayBtn = this.slider.querySelector('.autoplay-control');
        this.playIcon = this.slider.querySelector('.play-icon');
        this.pauseIcon = this.slider.querySelector('.pause-icon');
        this.progressBar = this.slider.querySelector('.progress');
        
        // State
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.autoplaySpeed = 5000; // 5 seconds
        this.isAutoPlaying = false;
        this.progressInterval = null;
        this.progressStep = 100 / (this.autoplaySpeed / 100); // For smooth progress bar
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        this.isTransitioning = false;
        this.keyboard = {
            enabled: true,
            left: 37,
            right: 39,
            space: 32
        };
        // Initialize slider
        this.initialize();
    }

    initialize() {
        // Create dots
        this.createDots();
        
        // Update counter
        this.updateCounter();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show first slide
        this.showSlide(0);
        
        // Start autoplay
        this.startAutoplay();

        // Add error handling for images
        this.handleImageLoading();
        
        // Set ARIA attributes for accessibility
        this.setupAccessibility();
    }

    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.setAttribute('data-index', i);
            this.dotsContainer.appendChild(dot);
        }
        this.dots = this.slider.querySelectorAll('.dot');
    }

    setupEventListeners() {
        // Button navigation
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dots navigation
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                this.showSlide(index);
            });
        });
        
        // Autoplay control
        this.autoplayBtn.addEventListener('click', () => {
            if (this.isAutoPlaying) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
        
        // Touch events for swipe
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.slider.classList.add('touching');
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.slider.classList.remove('touching');
            this.handleSwipe();
        }, { passive: true });
        
        // Pause autoplay when mouse enters slider
        this.slider.addEventListener('mouseenter', () => {
            if (this.isAutoPlaying) {
                this.pauseAutoplay();
            }
        });
        
        // Resume autoplay when mouse leaves slider
        this.slider.addEventListener('mouseleave', () => {
            if (this.isAutoPlaying) {
                this.resumeAutoplay();
            }
        });

        // Keyboard navigation
        if (this.keyboard.enabled) {
            document.addEventListener('keydown', (e) => {
                if (!this.slider.contains(document.activeElement) && 
                    !this.slider.matches(':hover')) {
                    return;
                }
                
                switch (e.keyCode) {
                    case this.keyboard.left:
                        this.prevSlide();
                        break;
                    case this.keyboard.right:
                        this.nextSlide();
                        break;
                    case this.keyboard.space:
                        if (this.isAutoPlaying) {
                            this.stopAutoplay();
                        } else {
                            this.startAutoplay();
                        }
                        e.preventDefault(); // Prevent page scrolling
                        break;
                }
            });
        }
        
        // Click on slide to go to next slide
        this.slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                // Prevent triggering if clicking on controls
                if (e.target.closest('.slider-controls') || 
                    e.target.closest('.prev') || 
                    e.target.closest('.next')) {
                    return;
                }
                this.nextSlide();
            });
        });
        
        // Enhanced touch events for better swipe detection
        let touchStartY = 0;
        let touchTimeStart = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            touchTimeStart = new Date().getTime();
            this.slider.classList.add('touching');
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const touchTimeEnd = new Date().getTime();
            
            this.slider.classList.remove('touching');
            this.handleSwipe(touchEndY - touchStartY, touchTimeEnd - touchTimeStart);
        }, { passive: true });
        
        // Mouse drag support (simulates swipe on desktop)
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        
        this.slider.addEventListener('mousedown', (e) => {
            // Only initiate drag on main content, not controls
            if (e.target.closest('.slider-controls') || 
                e.target.closest('.prev') || 
                e.target.closest('.next')) {
                return;
            }
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            this.slider.classList.add('touching');
            
            // Prevent text selection during drag
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            // Optional: add visual feedback during drag
            const moveX = e.clientX - startX;
            if (Math.abs(moveX) > 20) {
                document.body.style.cursor = 'grabbing';
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            
            const endX = e.clientX;
            const endY = e.clientY;
            const timeElapsed = 0; // We don't track time for mouse events
            
            isDragging = false;
            this.slider.classList.remove('touching');
            document.body.style.cursor = 'auto';
            
            // Process the drag as a swipe
            this.touchStartX = startX;
            this.touchEndX = endX;
            this.handleSwipe(endY - startY, timeElapsed);
        });
    }

    showSlide(index) {
        // Prevent slide change during transition
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        // Reset if out of bounds
        if (index < 0) {
            index = this.totalSlides - 1;
        } else if (index >= this.totalSlides) {
            index = 0;
        }
        
        // Update current index
        this.currentIndex = index;
        
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            // Ensure all slides have proper z-index
            slide.style.zIndex = '1';
        });
        
        // Add active class to current slide and set higher z-index
        this.slides[index].classList.add('active');
        this.slides[index].style.zIndex = '2';
        
        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update counter
        this.updateCounter();
        
        // Reset progress bar if autoplay is on
        if (this.isAutoPlaying) {
            this.resetProgressBar();
        }

        // Update ARIA attributes for accessibility
        this.updateAriaAttributes();
        
        // Force browser reflow to ensure transitions work
        this.slides[index].offsetHeight;
        
        // Allow next transition after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500); // Match this with your CSS transition duration
    }

    nextSlide() {
        this.showSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.showSlide(this.currentIndex - 1);
    }

    updateCounter() {
        this.currentCounter.textContent = this.currentIndex + 1;
        this.totalCounter.textContent = this.totalSlides;
    }

    startAutoplay() {
        this.isAutoPlaying = true;
        this.playIcon.classList.add('hidden');
        this.pauseIcon.classList.remove('hidden');
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplaySpeed);
        
        this.startProgressBar();

        // Update autoplay button accessibility state
        this.autoplayBtn.setAttribute('aria-pressed', 'true');
    }

    stopAutoplay() {
        this.isAutoPlaying = false;
        this.playIcon.classList.remove('hidden');
        this.pauseIcon.classList.add('hidden');
        
        clearInterval(this.autoplayInterval);
        clearInterval(this.progressInterval);
        this.progressBar.style.width = '0%';

        // Update autoplay button accessibility state
        this.autoplayBtn.setAttribute('aria-pressed', 'false');
    }

    pauseAutoplay() {
        clearInterval(this.autoplayInterval);
        clearInterval(this.progressInterval);
    }

    resumeAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplaySpeed);
        
        this.startProgressBar();
    }

    startProgressBar() {
        let progress = 0;
        this.progressBar.style.width = '0%';
        
        clearInterval(this.progressInterval);
        this.progressInterval = setInterval(() => {
            if (progress < 100) {
                progress += this.progressStep;
                this.progressBar.style.width = `${progress}%`;
            } else {
                clearInterval(this.progressInterval);
            }
        }, 100);
    }

    resetProgressBar() {
        clearInterval(this.progressInterval);
        this.progressBar.style.width = '0%';
        this.startProgressBar();
    }

    handleSwipe(verticalDistance = 0, timeElapsed = 0) {
        const horizontalDistance = this.touchEndX - this.touchStartX;
        const swipeDistance = Math.abs(horizontalDistance);
        
        // Check if it's a valid horizontal swipe (not vertical)
        if (swipeDistance > this.minSwipeDistance && 
            swipeDistance > Math.abs(verticalDistance) && 
            (timeElapsed === 0 || timeElapsed < 500)) { // Faster swipes are more intentional
            
            if (horizontalDistance > 0) {
                // Swipe right - go to previous slide
                this.prevSlide();
            } else {
                // Swipe left - go to next slide
                this.nextSlide();
            }
        }
    }

    handleImageLoading() {
        // Add loading state and error handling for images
        const images = this.slider.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading indicator only if image is not already loaded
            const slide = img.closest('.slide');
            if (!img.complete) {
                slide.classList.add('loading');
            }
            
            // Handle successful load
            img.addEventListener('load', () => {
                slide.classList.remove('loading');
                slide.classList.remove('error');
            });
            
            // Handle error
            img.addEventListener('error', () => {
                slide.classList.remove('loading');
                if (!img.getAttribute('data-fallback-applied')) {
                    slide.classList.add('error');
                }
            });
            
            // If image is already loaded (from cache), remove loading class immediately
            if (img.complete) {
                slide.classList.remove('loading');
            }
        });
        
        // Set a timeout to remove all loading classes after 3 seconds regardless of state
        // This prevents infinite loading animation if something goes wrong
        setTimeout(() => {
            this.slides.forEach(slide => {
                slide.classList.remove('loading');
            });
        }, 3000);
    }

    setupAccessibility() {
        // Add ARIA attributes for better accessibility
        this.slider.setAttribute('role', 'region');
        this.slider.setAttribute('aria-roledescription', 'carousel');
        
        this.slidesContainer.setAttribute('aria-live', 'polite');
        
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `Слайд ${index + 1} із ${this.totalSlides}`);
            slide.setAttribute('aria-hidden', index === this.currentIndex ? 'false' : 'true');
        });
        
        this.prevBtn.setAttribute('aria-label', 'Попередній слайд');
        this.nextBtn.setAttribute('aria-label', 'Наступний слайд');
        
        // Make autoplay button more accessible
        this.autoplayBtn.setAttribute('aria-pressed', this.isAutoPlaying ? 'true' : 'false');
    }

    updateAriaAttributes() {
        // Update ARIA attributes when slide changes
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index === this.currentIndex ? 'false' : 'true');
        });
        
        // Announce current slide for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.textContent = `Показано слайд ${this.currentIndex + 1} із ${this.totalSlides}`;
        
        this.slider.appendChild(liveRegion);
        setTimeout(() => {
            this.slider.removeChild(liveRegion);
        }, 1000);
    }
}

// Initialize the slider when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const slider = new ImageSlider();
        
        // Make slider instance available globally for debugging
        window.imageSlider = slider;
    } catch (error) {
        console.error('Error initializing slider:', error);
        // Show error message to user
        const container = document.querySelector('.slider-container');
        if (container) {
            container.innerHTML = '<div class="slider-error">Помилка ініціалізації слайдера</div>';
        }
    }
});
