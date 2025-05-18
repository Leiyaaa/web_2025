document.addEventListener('DOMContentLoaded', () => {
    const cache = new CacheManager();
    
    const currentTheme = StorageManager.getTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);

    document.getElementById('themeToggle').addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        StorageManager.setTheme(newTheme);
    });

    function updateStats() {
        document.getElementById('imagesLoaded').textContent = cache.imageCache.size;
        document.getElementById('cacheSize').textContent = 
            Math.round(JSON.stringify(Array.from(cache.cache.entries())).length / 1024);
    }

    setInterval(updateStats, 5000);

    const settings = StorageManager.getUserSettings() || { theme: 'light' };
    document.body.setAttribute('data-theme', settings.theme);
    document.getElementById('theme').value = settings.theme;

    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            username: e.target.username.value,
            theme: e.target.theme.value
        };
        StorageManager.saveUserSettings(formData);
        document.body.setAttribute('data-theme', formData.theme);
    });

    const galleryGrid = document.querySelector('.gallery-grid');
    galleryGrid.innerHTML = '<p>Завантаження галереї...</p>';
    
    Promise.all(Array.from({ length: 6 }, (_, i) => 
        cache.preloadImage(`https://picsum.photos/300/200?random=${i + 1}`))
    ).then(() => {
        galleryGrid.innerHTML = '';
        cache.imageCache.forEach((img, url) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${url}" alt="Gallery image">`;
            galleryGrid.appendChild(item);
        });
        updateStats();
    }).catch(error => {
        galleryGrid.innerHTML = '<p>Помилка завантаження зображень</p>';
        console.error('Gallery loading error:', error);
    });

    document.getElementById('loadContent').addEventListener('click', async () => {
        try {
            const data = await cache.getData('https://api.example.com/content');
            document.getElementById('contentContainer').textContent = data.content;
        } catch (error) {
            console.error('Failed to load content:', error);
        }
    });
});
