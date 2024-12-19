
export class BookDisplay {
    constructor(container) {
        this.container = container;
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'error-message';
        this.container.parentNode.insertBefore(this.errorContainer, this.container);
        
        this.loadingContainer = document.createElement('div');
        this.loadingContainer.className = 'loading-spinner';
        this.container.parentNode.insertBefore(this.loadingContainer, this.container);
    }

    displayBooks(books, append = false) {
        if (!append) {
            this.container.innerHTML = '';
        }
        
        const bookCards = books.map(book => this.createBookCard(book)).join('');
        
        if (append) {
            this.container.insertAdjacentHTML('beforeend', bookCards);
        } else {
            this.container.innerHTML = bookCards;
        }
        
        this.addBookCardListeners();
    }

    showLoading() {
        this.loadingContainer.style.display = 'block';
    }

    hideLoading() {
        this.loadingContainer.style.display = 'none';
    }

    showError(message) {
        this.errorContainer.innerHTML = `
            <div class="alert alert-error">
                <p>${message}</p>
                <button class="retry-btn">Try Again</button>
            </div>
        `;
        this.errorContainer.style.display = 'block';
    }

    hideError() {
        this.errorContainer.style.display = 'none';
    }

   
}


createBookCard(book) {
    return `
        <div class="book" data-id="${book.id}">
            <img src="${book.thumbnail}" alt="${book.title}">
            <p><strong>${book.title}</strong></p>
            <p class="authors">${book.authors.join(', ')}</p>
            <button class="favorite-btn" onclick="toggleFavorite('${book.id}')">
                ${this.isFavorite(book.id) ? '❤️' : '🤍'}
            </button>
        </div>
    `;
}

