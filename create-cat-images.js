document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing cat images...');
    
    // Get  slide images
    const slideImages = document.querySelectorAll('.slide img');
    
    // Set immediate cat SVG images while we try to load real ones
    slideImages.forEach((img, index) => {
        const catColors = ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6'];
        const catNumber = index + 1;
        const catColor = catColors[index % catColors.length];
        
        // Create a cat face SVG as immediate visual
        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='${catColor.replace('#', '%23')}'/%3E%3Ccircle cx='400' cy='200' r='120' fill='%23fff' opacity='0.8'/%3E%3Ccircle cx='360' cy='170' r='20' fill='${catColor.replace('#', '%23')}'/%3E%3Ccircle cx='440' cy='170' r='20' fill='${catColor.replace('#', '%23')}'/%3E%3Cpath d='M370 230 Q400 260 430 230' stroke='${catColor.replace('#', '%23')}' stroke-width='8' fill='none'/%3E%3Cpath d='M320 120 Q300 80 340 100' stroke='%23fff' stroke-width='8' fill='none'/%3E%3Cpath d='M480 120 Q500 80 460 100' stroke='%23fff' stroke-width='8' fill='none'/%3E%3Ctext x='400' y='320' font-family='Arial' font-size='30' text-anchor='middle' fill='%23fff'%3EКотик ${catNumber}%3C/text%3E%3C/svg%3E`;
        
        // Remove any loading indicators
        const slide = img.closest('.slide');
        if (slide) {
            slide.classList.remove('loading');
        }
    });
    
    // Try to load from multiple sources in sequence
    const catSources = [
        'https://api.thecatapi.com/v1/images/search?size=full',
        'https://aws.random.cat/meow',
        'https://cataas.com/cat?json=true'
    ];
    
    // Function to try loading cat from any source
    const loadCatImage = async (index) => {
        // Skip if index is out of bounds
        if (index >= slideImages.length) return;
        
        const img = slideImages[index];
        let success = false;
        
        // Try each source until one works
        for (const source of catSources) {
            if (success) break;
            
            try {
                const response = await fetch(source);
                const data = await response.json();
                
                // Extract URL based on API format
                let catUrl = '';
                if (data.url) {
                    catUrl = data.url; // random.cat format
                } else if (data.length && data[0].url) {
                    catUrl = data[0].url; // thecatapi format 
                } else if (data.url) {
                    catUrl = 'https://cataas.com' + data.url; // cataas format
                }
                
                if (catUrl) {
                    // Try to load the image
                    await new Promise((resolve, reject) => {
                        const testImg = new Image();
                        testImg.onload = () => {
                            img.src = catUrl;
                            success = true;
                            resolve();
                        };
                        testImg.onerror = reject;
                        testImg.src = catUrl;
                    });
                }
            } catch (error) {
                console.warn(`Source ${source} failed for image ${index + 1}:`, error);
            }
        }
        
        return success;
    };
    
    // Load cat images one by one to avoid overwhelming APIs
    const loadAllCats = async () => {
        for (let i = 0; i < slideImages.length; i++) {
            await loadCatImage(i);
            // Add a small delay between requests to be kind to the APIs
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    };
    
    // Start loading real cat images
    loadAllCats();
});
