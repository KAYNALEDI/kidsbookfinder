const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query, ageGroup, genre) {
    try {
        const ageFilter = getAgeFilter(ageGroup);
        const genreFilter = genre ? `+subject:${genre}` : '';
        const response = await fetch(
            `${BASE_URL}?q=${query}${genreFilter}${ageFilter}&key=${API_KEY}`
        );
        const data = await response.json();
        return formatBookResults(data.items);
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

function formatBookResults(books) {
    return books?.map(book => ({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['Unknown'],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
        description: book.volumeInfo.description || '',
        categories: book.volumeInfo.categories || []
    })) || [];
}

function getAgeFilter(ageGroup) {
    const ageRanges = {
        '5-7': 'juvenile',
        '8-10': 'juvenile',
        '11-13': 'young adult'
    };
    return ageGroup ? `+subject:${ageRanges[ageGroup]}` : '';
}

// js/api.js
export class BookAPI {
    constructor() {
        this.API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
        this.BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
        this.startIndex = 0;
        this.maxResults = 12;
    }

    async searchBooks(query, ageGroup, genre, loadMore = false) {
        if (!loadMore) {
            this.startIndex = 0;
        }

        try {
            const response = await this.fetchFromAPI(query, ageGroup, genre);
            this.startIndex += this.maxResults;
            return {
                books: this.formatBookResults(response.items),
                hasMore: response.totalItems > this.startIndex
            };
        } catch (error) {
            console.error('API Error:', error);
            return await this.getFallbackBooks();
        }
    }

    async fetchFromAPI(query, ageGroup, genre) {
        const ageFilter = this.getAgeFilter(ageGroup);
        const genreFilter = genre ? `+subject:${genre}` : '';
        
        const response = await fetch(
            `${this.BASE_URL}?q=${query}${genreFilter}${ageFilter}&startIndex=${this.startIndex}&maxResults=${this.maxResults}&key=${this.API_KEY}`,
            { signal: AbortSignal.timeout(5000) } // 5-second timeout
        );

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    }

    async getFallbackBooks() {
        try {
            const response = await fetch('/data/books.json');
            const data = await response.json();
            return {
                books: this.formatBookResults(data.items),
                hasMore: false
            };
        } catch (error) {
            console.error('Fallback Error:', error);
            return { books: [], hasMore: false };
        }
    }

   
}



export class BookAPI {
    constructor() {
        this.BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
        this.startIndex = 0;
        this.maxResults = 12;
    }

    async searchBooks(query, ageGroup = '', genre = '', loadMore = false) {
        if (!loadMore) {
            this.startIndex = 0;
        }

        try {
            // Construct search query
            let searchQuery = query;
            if (ageGroup) searchQuery += `+subject:${this.getAgeFilter(ageGroup)}`;
            if (genre) searchQuery += `+subject:${genre}`;

            const url = `${this.BASE_URL}?q=${encodeURIComponent(searchQuery)}&startIndex=${this.startIndex}&maxResults=${this.maxResults}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const data = await response.json();
            this.startIndex += this.maxResults;

            return {
                books: this.formatBookResults(data.items || []),
                hasMore: data.totalItems > this.startIndex,
                totalItems: data.totalItems
            };
        } catch (error) {
            console.error('Error fetching books:', error);
            return await this.getFallbackBooks();
        }
    }

    formatBookResults(books) {
        return books.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || ['Unknown Author'],
            description: book.volumeInfo.description || 'No description available',
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || '/images/no-cover.png',
            categories: book.volumeInfo.categories || [],
            pageCount: book.volumeInfo.pageCount,
            publishedDate: book.volumeInfo.publishedDate,
            averageRating: book.volumeInfo.averageRating,
            maturityRating: book.volumeInfo.maturityRating,
            language: book.volumeInfo.language,
            previewLink: book.volumeInfo.previewLink,
            infoLink: book.volumeInfo.infoLink
        }));
    }

    getAgeFilter(ageGroup) {
        // Map age groups to appropriate search terms
        const ageFilters = {
            '5-7': 'juvenile',
            '8-10': 'juvenile',
            '11-13': 'young adult'
        };
        return ageFilters[ageGroup] || '';
    }

    async getBookDetails(bookId) {
        try {
            const response = await fetch(`${this.BASE_URL}/${bookId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }
            const data = await response.json();
            return this.formatBookResults([data])[0];
        } catch (error) {
            console.error('Error fetching book details:', error);
            return null;
        }
    }

    async getFallbackBooks() {
        try {
            const response = await fetch('/data/books.json');
            const data = await response.json();
            return {
                books: this.formatBookResults(data.items),
                hasMore: false,
                totalItems: data.items.length
            };
        } catch (error) {
            console.error('Error loading fallback books:', error);
            return { books: [], hasMore: false, totalItems: 0 };
        }
    }
}


export class BookDisplay {
    constructor(container) {
        this.container = container;
        this.modal = this.createModal();
        document.body.appendChild(this.modal);
    }

    createBookCard(book) {
        return `
            <div class="book-card" data-id="${book.id}">
                <img src="${book.thumbnail}" alt="${book.title}" class="book-cover">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="authors">${book.authors.join(', ')}</p>
                    <div class="book-meta">
                        ${book.averageRating ? `
                            <span class="rating">★ ${book.averageRating}</span>
                        ` : ''}
                        ${book.pageCount ? `
                            <span class="pages">${book.pageCount} pages</span>
                        ` : ''}
                    </div>
                    <button class="view-details-btn" onclick="showBookDetails('${book.id}')">
                        View Details
                    </button>
                    <button class="favorite-btn" onclick="toggleFavorite('${book.id}')">
                        ${this.isFavorite(book.id) ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'book-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        return modal;
    }

    async showBookDetails(bookId) {
        const api = new BookAPI();
        const book = await api.getBookDetails(bookId);
        
        if (!book) {
            alert('Unable to load book details');
            return;
        }

        this.modal.querySelector('.modal-body').innerHTML = `
            <div class="book-detail">
                <div class="book-detail-header">
                    <img src="${book.thumbnail}" alt="${book.title}" class="detail-cover">
                    <div class="detail-info">
                        <h2>${book.title}</h2>
                        <p class="detail-authors">By ${book.authors.join(', ')}</p>
                        ${book.averageRating ? `
                            <div class="detail-rating">
                                <span>★ ${book.averageRating}</span>
                            </div>
                        ` : ''}
                        <div class="detail-meta">
                            ${book.pageCount ? `<span>${book.pageCount} pages</span>` : ''}
                            ${book.publishedDate ? `<span>Published: ${new Date(book.publishedDate).getFullYear()}</span>` : ''}
                            ${book.categories ? `<span>Categories: ${book.categories.join(', ')}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="book-description">
                    ${book.description || 'No description available'}
                </div>
                <div class="book-actions">
                    ${book.previewLink ? `
                        <a href="${book.previewLink}" target="_blank" class="preview-btn">Preview Book</a>
                    ` : ''}
                    <button class="favorite-btn" onclick="toggleFavorite('${book.id}')">
                        ${this.isFavorite(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
        `;

        this.modal.style.display = 'block';
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading books...</p>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}



//not sure about this one//

class BookAPI {
    constructor() {
        // API configurations
        this.GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';
        this.CHILDRENS_API_URL = 'https://best-childrens-books.p.rapidapi.com/books';
        this.RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;
        this.GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
        this.startIndex = 0;
        this.maxResults = 12;
    }

    // Google Books API search
    async searchBooks(query, ageGroup = '', genre = '', loadMore = false) {
        if (!loadMore) {
            this.startIndex = 0;
        }

        try {
            let searchQuery = query;
            if (ageGroup) searchQuery += `+subject:${this.getAgeFilter(ageGroup)}`;
            if (genre) searchQuery += `+subject:${genre}`;

            const url = `${this.GOOGLE_BOOKS_URL}?q=${encodeURIComponent(searchQuery)}&startIndex=${this.startIndex}&maxResults=${this.maxResults}&key=${this.GOOGLE_API_KEY}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch books');

            const data = await response.json();
            this.startIndex += this.maxResults;

            return {
                books: this.formatGoogleBooks(data.items || []),
                hasMore: data.totalItems > this.startIndex,
                totalItems: data.totalItems
            };
        } catch (error) {
            console.error('Error fetching books:', error);
            return await this.getFallbackBooks();
        }
    }

    // RapidAPI Children's Books recommendations
    async getRecommendedBooks() {
        try {
            const response = await fetch(`${this.CHILDRENS_API_URL}/timegoodreads`, {
                headers: {
                    'x-rapidapi-host': 'best-childrens-books.p.rapidapi.com',
                    'x-rapidapi-key': this.RAPID_API_KEY
                }
            });

            if (!response.ok) throw new Error('Failed to fetch recommendations');

            const data = await response.json();
            return this.formatRecommendedBooks(data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }
    }

    // Format Google Books API results
    formatGoogleBooks(books) {
        return books.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || ['Unknown Author'],
            description: book.volumeInfo.description || 'No description available',
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || '/images/no-cover.png',
            categories: book.volumeInfo.categories || [],
            pageCount: book.volumeInfo.pageCount,
            publishedDate: book.volumeInfo.publishedDate,
            averageRating: book.volumeInfo.averageRating,
            maturityRating: book.volumeInfo.maturityRating,
            language: book.volumeInfo.language,
            previewLink: book.volumeInfo.previewLink,
            infoLink: book.volumeInfo.infoLink
        }));
    }

    // Format RapidAPI results
    formatRecommendedBooks(books) {
        return books.map(book => ({
            id: book.id || `rec-${Math.random().toString(36).substr(2, 9)}`,
            title: book.title,
            authors: book.author ? [book.author] : ['Unknown Author'],
            thumbnail: book.image || '/images/no-cover.png',
            description: book.description || 'No description available',
            rating: book.rating,
            recommended: true
        }));
    }

    // Get age-appropriate filter
    getAgeFilter(ageGroup) {
        const ageFilters = {
            '5-7': 'juvenile',
            '8-10': 'juvenile',
            '11-13': 'young adult'
        };
        return ageFilters[ageGroup] || '';
    }

    // Fetch specific book details
    async getBookDetails(bookId) {
        try {
            const response = await fetch(
                `${this.GOOGLE_BOOKS_URL}/${bookId}?key=${this.GOOGLE_API_KEY}`
            );
            if (!response.ok) throw new Error('Failed to fetch book details');
            
            const data = await response.json();
            return this.formatGoogleBooks([data])[0];
        } catch (error) {
            console.error('Error fetching book details:', error);
            return null;
        }
    }

    // Fallback for when API calls fail
    async getFallbackBooks() {
        try {
            const response = await fetch('/data/books.json');
            const data = await response.json();
            return {
                books: this.formatGoogleBooks(data.items),
                hasMore: false,
                totalItems: data.items.length
            };
        } catch (error) {
            console.error('Error loading fallback books:', error);
            return { books: [], hasMore: false, totalItems: 0 };
        }
    }
}

// Example usage:
const api = new BookAPI();

// Search for books
async function searchExample() {
    const searchResults = await api.searchBooks('harry potter', '8-10', 'fantasy');
    console.log('Search results:', searchResults);
}

// Get recommendations
async function getRecommendationsExample() {
    const recommendations = await api.getRecommendedBooks();
    console.log('Recommendations:', recommendations);
}

// Get book details
async function getBookDetailsExample(bookId) {
    const bookDetails = await api.getBookDetails(bookId);
    console.log('Book details:', bookDetails);
}

export default BookAPI;

