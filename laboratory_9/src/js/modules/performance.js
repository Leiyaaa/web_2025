export const performanceMonitor = {
    metrics: {
        fcp: 0,
        lcp: 0,
        cls: 0,
        loadTime: 0
    },

    init() {
        this.observeCoreWebVitals();
        this.measureLoadTime();
    },

    observeCoreWebVitals() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    const value = entry.name === 'CLS' ? entry.value : entry.startTime;
                    this.metrics[entry.name.toLowerCase()] = Math.round(value * 100) / 100;
                    this.updateMetricsDisplay();
                });
            }).observe({ entryTypes: ['LCP', 'FCP', 'CLS'] });
        }
    },

    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.loadTime = Math.round(loadTime) / 1000;
            this.updateMetricsDisplay();
        });
    },

    updateMetricsDisplay() {
        Object.keys(this.metrics).forEach(metric => {
            const element = document.getElementById(metric);
            if (element) {
                element.textContent = metric === 'loadTime' 
                    ? `${this.metrics[metric]}s`
                    : this.metrics[metric];
            }
        });
    }
};
