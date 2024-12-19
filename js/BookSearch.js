import React, { useState, useEffect } from 'react';
import BookAPI from '../services/BookAPI'; // Adjust this path based on where you saved BookAPI.js

function BookSearch() {
    const [books, setBooks] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [age, setAge] = useState('');
    const [genre, setGenre] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const api = new BookAPI();

    useEffect(() => {
        // Load recommendations when component mounts
        async function loadRecommendations() {
            setIsLoading(true);
            const recommendedBooks = await api.getRecommendedBooks();
            setRecommendations(recommendedBooks);
            setIsLoading(false);
        }
        loadRecommendations();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const results = await api.searchBooks(searchTerm, age, genre);
        setBooks(results.books);
        setIsLoading(false);
    };

    return (
        <div className="book-search">
            <h2>Search Children's Books</h2>
            
            {/* Search Form */}
            <form onSubmit={handleSearch}>
                <div className="search-controls">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for books..."
                    />
                    
                    <select value={age} onChange={(e) => setAge(e.target.value)}>
                        <option value="">Select Age Range</option>
                        <option value="5-7">5-7 years</option>
                        <option value="8-10">8-10 years</option>
                        <option value="11-13">11-13 years</option>
                    </select>
                    
                    <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                        <option value="">Select Genre</option>
                        <option value="fantasy">Fantasy</option>
                        <option value="adventure">Adventure</option>
                        <option value="education">Education</option>
                        <option value="fiction">Fiction</option>
                    </select>
                    
                    <button type="submit">Search</button>
                </div>
            </form>

            {/* Loading State */}
            {isLoading && <div className="loading">Loading...</div>}

            {/* Search Results */}
            {books.length > 0 && (
                <div className="search-results">
                    <h3>Search Results</h3>
                    <div className="books-grid">
                        {books.map(book => (
                            <div key={book.id} className="book-card">
                                <img src={book.thumbnail} alt={book.title} />
                                <h4>{book.title}</h4>
                                <p>{book.authors.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="recommendations">
                    <h3>Recommended Books</h3>
                    <div className="books-grid">
                        {recommendations.map(book => (
                            <div key={book.id} className="book-card">
                                <img src={book.thumbnail} alt={book.title} />
                                <h4>{book.title}</h4>
                                <p>{book.authors.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookSearch;
