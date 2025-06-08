document.addEventListener('DOMContentLoaded', () => {
    // Alternate set of cat images - using a different service
    const ultimateFallbackImages = [
        'https://api.thecatapi.com/v1/images/search?size=full',
        'https://api.thecatapi.com/v1/images/search?size=full',
        'https://api.thecatapi.com/v1/images/search?size=full',
        'https://api.thecatapi.com/v1/images/search?size=full',
        'https://api.thecatapi.com/v1/images/search?size=full'
    ];
    
    //  cat SVGs for final fallback
    const embeddedCatImages = [
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%233498db'/%3E%3Cpath d='M400 100c-40 0-75 30-75 70s35 70 75 70 75-30 75-70-35-70-75-70zm-28 40c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zm56 0c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zM400 220c-20 0-35-10-35-10s10 25 35 25 35-25 35-25-15 10-35 10z' fill='%23fff'/%3E%3Cpath d='M460 140c15-25 35-15 45-5s10 30-5 35c-10 5-25 0-30-10s-10-20-10-20zm-120 0c-15-25-35-15-45-5s-10 30 5 35c10 5 25 0 30-10s10-20 10-20z' fill='%23fff'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='30' text-anchor='middle' fill='%23fff'%3EКотик 1%3C/text%3E%3C/svg%3E`,
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%2327ae60'/%3E%3Cpath d='M400 100c-40 0-75 30-75 70s35 70 75 70 75-30 75-70-35-70-75-70zm-28 40c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zm56 0c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zM400 220c-20 0-35-10-35-10s10 25 35 25 35-25 35-25-15 10-35 10z' fill='%23fff'/%3E%3Cpath d='M460 140c15-25 35-15 45-5s10 30-5 35c-10 5-25 0-30-10s-10-20-10-20zm-120 0c-15-25-35-15-45-5s-10 30 5 35c10 5 25 0 30-10s10-20 10-20z' fill='%23fff'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='30' text-anchor='middle' fill='%23fff'%3EКотик 2%3C/text%3E%3C/svg%3E`,
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23f39c12'/%3E%3Cpath d='M400 100c-40 0-75 30-75 70s35 70 75 70 75-30 75-70-35-70-75-70zm-28 40c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zm56 0c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zM400 220c-20 0-35-10-35-10s10 25 35 25 35-25 35-25-15 10-35 10z' fill='%23fff'/%3E%3Cpath d='M460 140c15-25 35-15 45-5s10 30-5 35c-10 5-25 0-30-10s-10-20-10-20zm-120 0c-15-25-35-15-45-5s-10 30 5 35c10 5 25 0 30-10s10-20 10-20z' fill='%23fff'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='30' text-anchor='middle' fill='%23fff'%3EКотик 3%3C/text%3E%3C/svg%3E`,
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23e74c3c'/%3E%3Cpath d='M400 100c-40 0-75 30-75 70s35 70 75 70 75-30 75-70-35-70-75-70zm-28 40c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zm56 0c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zM400 220c-20 0-35-10-35-10s10 25 35 25 35-25 35-25-15 10-35 10z' fill='%23fff'/%3E%3Cpath d='M460 140c15-25 35-15 45-5s10 30-5 35c-10 5-25 0-30-10s-10-20-10-20zm-120 0c-15-25-35-15-45-5s-10 30 5 35c10 5 25 0 30-10s10-20 10-20z' fill='%23fff'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='30' text-anchor='middle' fill='%23fff'%3EКотик 4%3C/text%3E%3C/svg%3E`,
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%239b59b6'/%3E%3Cpath d='M400 100c-40 0-75 30-75 70s35 70 75 70 75-30 75-70-35-70-75-70zm-28 40c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zm56 0c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15zM400 220c-20 0-35-10-35-10s10 25 35 25 35-25 35-25-15 10-35 10z' fill='%23fff'/%3E%3Cpath d='M460 140c15-25 35-15 45-5s10 30-5 35c-10 5-25 0-30-10s-10-20-10-20zm-120 0c-15-25-35-15-45-5s-10 30 5 35c10 5 25 0 30-10s10-20 10-20z' fill='%23fff'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='30' text-anchor='middle' fill='%23fff'%3EКотик 5%3C/text%3E%3C/svg%3E`
    ];
    
    // Get all slide images
    const slideImages = document.querySelectorAll('.slide img');
    
    // Pre-load all images to avoid loading spinner
    Promise.all([...slideImages].map(img => {
        return new Promise((resolve) => {
            // If already loaded, resolve immediately
            if (img.complete) {
                resolve();
                return;
            }
            
            // Create a temporary image to pre-load
            const tempImg = new Image();
            tempImg.src = img.src;
            
            // Once loaded, resolve
            tempImg.onload = () => {
                resolve();
            };
            
            // If error, use fallback
            tempImg.onerror = () => {
                resolve();
            };
        });
    })).then(() => {
        // Once all images are pre-loaded, remove loading class from all slides
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('loading');
        });
    });
    
    // Apply fallback images with a short timeout
    slideImages.forEach((img, index) => {
        // Set a timeout to check if image is loaded
        const timeout = setTimeout(() => {
            if (!img.complete || img.naturalHeight === 0) {
                applyFallback(img, index);
            }
        }, 1000); // 1 second timeout (reduced from 3 seconds)
        
        // Handle load errors
        img.addEventListener('error', () => {
            clearTimeout(timeout);
            applyFallback(img, index);
        });
        
        // Clear timeout if image loads successfully
        img.addEventListener('load', () => {
            clearTimeout(timeout);
            // Remove loading class when image loads successfully
            const slide = img.closest('.slide');
            if (slide) {
                slide.classList.remove('loading');
            }
        });
    });
    
    // Function to apply fallback image
    function applyFallback(img, index) {
        if (index < embeddedCatImages.length) {
            // Store original src for debugging
            const originalSrc = img.src;
            
            // First try with the fallback API
            fetch(ultimateFallbackImages[index])
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0 && data[0].url) {
                        img.src = data[0].url;
                        img.setAttribute('data-fallback-applied', 'true');
                        console.info(`Applied API fallback for image ${index + 1}`);
                    } else {
                        // If API fails, use our embedded SVG cat
                        img.src = embeddedCatImages[index];
                        img.setAttribute('data-fallback-applied', 'true');
                        console.info(`Applied embedded fallback for image ${index + 1}`);
                    }
                })
                .catch(error => {
                    // Use embedded SVG as final fallback
                    img.src = embeddedCatImages[index];
                    img.setAttribute('data-fallback-applied', 'true');
                    console.error(`API fallback failed for image ${index + 1}, using embedded SVG`);
                });
        }
    }
    
    // Preload fallback images
    ultimateFallbackImages.forEach(src => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = src;
        document.head.appendChild(preloadLink);
    });
});
