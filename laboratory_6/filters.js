class FilterSystem {
    constructor(items) {
        this.allItems = items;
        this.filters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'name-asc'
        };
    }

    applyFilters() {
        let filtered = [...this.allItems];

        if (this.filters.search) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(this.filters.search.toLowerCase())
            );
        }

        if (this.filters.category) {
            filtered = filtered.filter(item => 
                item.category === this.filters.category
            );
        }

        if (this.filters.minPrice) {
            filtered = filtered.filter(item => 
                item.price >= Number(this.filters.minPrice)
            );
        }
        if (this.filters.maxPrice) {
            filtered = filtered.filter(item => 
                item.price <= Number(this.filters.maxPrice)
            );
        }

        const [sortKey, sortDir] = this.filters.sortBy.split('-');
        filtered.sort((a, b) => {
            let comparison = 0;
            if (sortKey === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortKey === 'price') {
                comparison = a.price - b.price;
            }
            return sortDir === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }

    setFilter(key, value) {
        this.filters[key] = value;
    }

    getActiveFilters() {
        return Object.entries(this.filters)
            .filter(([key, value]) => value !== '' && key !== 'sortBy')
            .map(([key, value]) => ({ key, value }));
    }

    resetFilters() {
        this.filters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'name-asc'
        };
    }
}
