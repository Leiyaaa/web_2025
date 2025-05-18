class CacheManager {
    constructor() {
        this.cache = new Map();
        this.imageCache = new Map();
    }

    async getData(url, ttl = 300000) {
        const cached = this.cache.get(url);
        if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.data;
        }

        const response = await fetch(url);
        const data = await response.json();
        this.cache.set(url, {
            data,
            timestamp: Date.now()
        });
        return data;
    }

    async preloadImage(url) {
        if (this.imageCache.has(url)) {
            return this.imageCache.get(url);
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(url, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    clearCache() {
        this.cache.clear();
        this.imageCache.clear();
    }
}
