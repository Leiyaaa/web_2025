document.addEventListener('DOMContentLoaded', () => {
    // Check  slides are properly visible
    setTimeout(() => {
        console.log('Debug: Checking slider state...');
        
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            const isActive = slide.classList.contains('active');
            const opacity = getComputedStyle(slide).opacity;
            const zIndex = getComputedStyle(slide).zIndex;
            const visibility = getComputedStyle(slide).visibility;
            
            console.log(`Slide ${index + 1}:`, {
                active: isActive,
                opacity: opacity,
                zIndex: zIndex,
                visibility: visibility,
                imgComplete: img.complete,
                imgNaturalWidth: img.naturalWidth,
                imgNaturalHeight: img.naturalHeight
            });
            
            // Ensure images are fully loaded
            if (img.complete && img.naturalWidth === 0) {
                console.error(`Image ${index + 1} failed to load correctly`);
                // Force reload with a data URI fallback
                img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23${getRandomColor()}'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='30' text-anchor='middle' dominant-baseline='middle' fill='white'%3EЗображення ${index + 1}%3C/text%3E%3C/svg%3E`;
            }
        });
        
        // Fix potential issues with slider initialization
        if (window.imageSlider) {
            console.log('Forcing slide refresh...');
            const currentIndex = window.imageSlider.currentIndex;
            window.imageSlider.showSlide(currentIndex);
        }
    }, 1000);
    
    // Generate random color for emergency fallback images
    function getRandomColor() {
        const colors = ['1E88E5', '43A047', 'F9A825', 'E53935', '5E35B1'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});
