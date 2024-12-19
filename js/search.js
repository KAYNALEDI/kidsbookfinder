export class Search {
    constructor(onSearch) {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.onSearch = onSearch;
        this.setupEventListeners();
    }

    setupEventListeners() {
        let debounceTimeout;

        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 500);
        });

        this.searchButton.addEventListener('click', () => {
            this.handleSearch(this.searchInput.value);
        });

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(this.searchInput.value);
            }
        });
    }

    handleSearch(query) {
        if (query.trim().length > 0) {
            this.onSearch(query);
        }
    }
}
