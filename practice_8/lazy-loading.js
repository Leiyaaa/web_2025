document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    function handleError(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'error-placeholder';
        placeholder.innerHTML = `
            <div>
                <p>Зображення недоступне</p>
                <button onclick="retryLoading(this, '${img.dataset.src}')">Спробувати ще раз</button>
            </div>
        `;
        img.parentNode.appendChild(placeholder);
        img.style.display = 'none';
    }

    function retryLoading(button, src) {
        const container = button.closest('.gallery-item');
        const img = container.querySelector('img');
        const placeholder = container.querySelector('.error-placeholder');
        
        img.style.display = 'block';
        img.src = src;
        placeholder.remove();
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.addEventListener('error', () => handleError(img));
                img.addEventListener('load', () => img.classList.add('loaded'));
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
        img.addEventListener('error', () => handleError(img));
    });

    window.retryLoading = retryLoading;
});
