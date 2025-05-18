document.addEventListener('DOMContentLoaded', () => {
    const filterSystem = new FilterSystem(items);
    const container = document.getElementById('itemsContainer');
    const activeFilters = document.getElementById('activeFilters');

    function renderItems(items) {
        container.innerHTML = items.map(item => `
            <div class="item-card">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.price} грн</p>
                <span class="category">${item.category}</span>
            </div>
        `).join('');
    }

    function renderActiveFilters() {
        const filters = filterSystem.getActiveFilters();
        activeFilters.innerHTML = filters.map(filter => `
            <span class="filter-tag">
                ${filter.key}: ${filter.value}
                <button onclick="removeFilter('${filter.key}')">&times;</button>
            </span>
        `).join('');
    }

    function updateDisplay() {
        const filteredItems = filterSystem.applyFilters();
        renderItems(filteredItems);
        renderActiveFilters();
        saveFiltersToStorage();
    }

    document.getElementById('search').addEventListener('input', e => {
        filterSystem.setFilter('search', e.target.value);
        updateDisplay();
    });

    document.getElementById('category').addEventListener('change', e => {
        filterSystem.setFilter('category', e.target.value);
        updateDisplay();
    });

    document.getElementById('minPrice').addEventListener('change', e => {
        filterSystem.setFilter('minPrice', e.target.value);
        updateDisplay();
    });

    document.getElementById('maxPrice').addEventListener('change', e => {
        filterSystem.setFilter('maxPrice', e.target.value);
        updateDisplay();
    });

    document.getElementById('sortBy').addEventListener('change', e => {
        filterSystem.setFilter('sortBy', e.target.value);
        updateDisplay();
    });

    document.getElementById('resetFilters').addEventListener('click', () => {
        filterSystem.resetFilters();
        // Reset form inputs
        document.getElementById('search').value = '';
        document.getElementById('category').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('sortBy').value = 'name-asc';
        updateDisplay();
    });

    function saveFiltersToStorage() {
        localStorage.setItem('filters', JSON.stringify(filterSystem.filters));
    }

    function loadFiltersFromStorage() {
        const saved = localStorage.getItem('filters');
        if (saved) {
            const filters = JSON.parse(saved);
            Object.entries(filters).forEach(([key, value]) => {
                filterSystem.setFilter(key, value);
                const element = document.getElementById(key);
                if (element) element.value = value;
            });
        }
    }

    loadFiltersFromStorage();
    updateDisplay();
});
