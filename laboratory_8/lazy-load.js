class LazyLoader {
    constructor() {
        this.imageObserver = new IntersectionObserver(
            (entries, observer) => this.handleIntersection(entries, observer),
            {
                rootMargin: '50px 0px',
                threshold: 0.01
            }
        );

        this.initializeLazyLoading();
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(image) {
        const src = image.dataset.src;
        const srcset = image.dataset.srcset;
        const sizes = image.dataset.sizes;

        if (srcset) {
            image.srcset = srcset;
        }
        if (sizes) {
            image.sizes = sizes;
        }
        if (src) {
            image.src = src;
        }

        image.addEventListener('load', () => {
            image.classList.add('loaded');
        });
    }

    initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => this.imageObserver.observe(img));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
});
