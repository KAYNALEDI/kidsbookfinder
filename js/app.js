// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for animation triggers
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// Navigation scroll effect
let lastScroll = 0;
const nav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Mobile menu toggle (if you add a hamburger menu)
const createMobileMenu = () => {
    const nav = document.querySelector('.main-nav');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '☰';
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.querySelector('.nav-links').classList.toggle('show');
    });
    
    if (window.innerWidth <= 768) {
        nav.appendChild(mobileMenuBtn);
    }
};

// Initialize mobile menu
createMobileMenu();

// Resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-btn')) {
            createMobileMenu();
        }
    } else {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.remove();
        }
    }
});

import { BookSearch } from './modules/BookSearch.js';
import { FavoriteManager } from './modules/FavoriteManager.js';
import { ReadingProgress } from './modules/ReadingProgress.js';
import { ParentDashboard } from './modules/ParentDashboard.js';
import { AccessibilityManager } from './modules/AccessibilityManager.js';

class App {
    constructor() {
        this.bookSearch = new BookSearch();
        this.favoriteManager = new FavoriteManager();
        this.readingProgress = new ReadingProgress();
        this.parentDashboard = new ParentDashboard();
        this.accessibilityManager = new AccessibilityManager();
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.checkParentMode();
        this.loadUserPreferences();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('bookSearchForm')
            .addEventListener('submit', this.handleSearch.bind(this));

        // Parent mode toggle
        document.getElementById('parentModeToggle')
            .addEventListener('click', this.toggleParentMode.bind(this));
    }

    async handleSearch(event) {
        event.preventDefault();
        
        try {
            await this.bookSearch.performSearch();
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        console.error('Error:', error);
        const errorElement = document.getElementById('error');
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});

import React from 'react';
import BookSearch from './components/BookSearch';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Children's Book Search</h1>
            </header>
            <main>
                <BookSearch />
            </main>
        </div>
    );
}

export default App;

// User Authentication and Dashboard Management
class UserDashboard {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.userDashboard = document.getElementById('userDashboard');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        this.init();
    }

    init() {
        // Check if user is logged in
        this.checkAuthStatus();
        
        // Add event listeners
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));
        this.logoutBtn?.addEventListener('click', () => this.handleLogout());
    }

    checkAuthStatus() {
        const user = this.getCurrentUser();
        if (user) {
            this.showDashboard(user);
        }
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Simulate API call - replace with your actual login API
            const user = this.authenticateUser(username, password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.showDashboard(user);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    authenticateUser(username, password) {
        // Simulate user authentication - replace with actual authentication
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => 
            user.username === username && user.password === password
        );
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const age = document.getElementById('age').value;
        const readingLevel = document.getElementById('readingLevel').value;
        const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
            .map(checkbox => checkbox.value);

        try {
            const user = {
                username,
                password,
                age,
                readingLevel,
                interests,
                readingHistory: []
            };

            // Save user - replace with actual API call
            this.saveUser(user);
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showDashboard(user);
        } catch (error) {
            this.showError(error.message);
        }
    }

    saveUser(user) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.username === user.username)) {
            throw new Error('Username already exists');
        }
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    showDashboard(user) {
        // Hide auth forms
        if (this.loginForm) this.loginForm.classList.add('hidden');
        if (this.registerForm) this.registerForm.classList.add('hidden');
        
        // Show dashboard
        this.userDashboard.classList.remove('hidden');
        
        // Update dashboard content
        document.getElementById('displayUsername').textContent = user.username;
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileAge').textContent = user.age;
        document.getElementById('profileReadingLevel').textContent = user.readingLevel;
        
        // Display interests
        const interestsContainer = document.getElementById('userInterests');
        interestsContainer.innerHTML = user.interests
            .map(interest => `<span class="interest-tag">${interest}</span>`)
            .join('');
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        window.location.reload();
    }

    showError(message) {
        // Implement error display logic
        alert(message);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserDashboard();
});

<script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (username && password) {
                // Store user info in localStorage (for demo purposes)
                localStorage.setItem('currentUser', JSON.stringify({
                    username: username,
                    isLoggedIn: true
                }));
                
                // Redirect to profile page
                window.location.href = 'profile.html';
            } else {
                alert('Please fill in all fields');
            }
        });
    </script>
