class GitHubRepoBrowser {
    constructor() {
        this.currentPage = 1;
        this.perPage = 10;
        this.cache = new Map();
        
        this.initElements();
        this.initEventListeners();
        this.loadData();
    }

    initElements() {
        this.searchInput = document.getElementById('searchInput');
        this.languageFilter = document.getElementById('languageFilter');
        this.reposContainer = document.getElementById('repos');
        this.loader = document.getElementById('loader');
        this.error = document.getElementById('error');
        this.prevButton = document.getElementById('prevPage');
        this.nextButton = document.getElementById('nextPage');
        this.currentPageSpan = document.getElementById('currentPage');
    }

    initEventListeners() {
        this.searchInput.addEventListener('input', () => {
            this.currentPage = 1;
            this.loadData();
        });
        
        this.languageFilter.addEventListener('change', () => {
            this.currentPage = 1;
            this.loadData();
        });

        this.prevButton.addEventListener('click', () => this.changePage(-1));
        this.nextButton.addEventListener('click', () => this.changePage(1));
    }

    async loadData() {
        const query = this.searchInput.value;
        const cacheKey = `${query}_${this.currentPage}`;

        if (this.cache.has(cacheKey)) {
            this.displayData(this.cache.get(cacheKey));
            return;
        }

        this.showLoader();
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${query || 'stars:>1000'}&sort=stars&page=${this.currentPage}&per_page=${this.perPage}`);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            this.cache.set(cacheKey, data);
            this.updateLanguageFilter(data.items);
            this.displayData(data);
        } catch (error) {
            this.showError('Failed to load repositories. Please try again later.');
        } finally {
            this.hideLoader();
        }
    }

    updateLanguageFilter(repos) {
        const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
        const currentValue = this.languageFilter.value;
        
        this.languageFilter.innerHTML = '<option value="">All Languages</option>' +
            languages.map(lang => `<option value="${lang}" ${lang === currentValue ? 'selected' : ''}>${lang}</option>`).join('');
    }

    displayData(data) {
        const filteredRepos = this.languageFilter.value ? 
            data.items.filter(repo => repo.language === this.languageFilter.value) :
            data.items;

        this.reposContainer.innerHTML = filteredRepos.map(repo => `
            <div class="repo-card">
                <h3><a href="${repo.html_url}" target="_blank">${repo.full_name}</a></h3>
                <p>${repo.description || 'No description available'}</p>
                <span class="language">${repo.language || 'Unknown'}</span>
                <div>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</div>
            </div>
        `).join('');

        this.updatePagination(data.total_count);
    }

    changePage(delta) {
        this.currentPage += delta;
        this.loadData();
    }

    updatePagination(totalCount) {
        const totalPages = Math.ceil(totalCount / this.perPage);
        this.currentPageSpan.textContent = this.currentPage;
        this.prevButton.disabled = this.currentPage === 1;
        this.nextButton.disabled = this.currentPage === totalPages;
    }

    showLoader() {
        this.loader.classList.add('visible');
        this.error.style.display = 'none';
    }

    hideLoader() {
        this.loader.classList.remove('visible');
    }

    showError(message) {
        this.error.textContent = message;
        this.error.style.display = 'block';
        this.reposContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GitHubRepoBrowser();
});
