class ProfileManager {
    constructor() {
        this.profiles = this.loadProfiles();
        this.currentUser = null;
        this.initializeEventListeners();
        this.checkLoggedInStatus();
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    }

    switchTab(tab) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tab);
        });

        // Show/hide forms
        document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
        document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
    }

    loadProfiles() {
        const profiles = localStorage.getItem('profiles');
        return profiles ? JSON.parse(profiles) : [];
    }

    saveProfiles() {
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
    }

    handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const profile = this.profiles.find(p => 
            p.username === username && p.password === password
        );

        if (profile) {
            this.currentUser = profile;
            localStorage.setItem('currentUser', JSON.stringify(profile));
            this.showProfile();
        } else {
            this.showError('Invalid username or password');
        }
    }

    handleRegistration() {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const age = document.getElementById('age').value;
        const readingLevel = document.getElementById('readingLevel').value;
        const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
            .map(cb => cb.value);

        if (this.profiles.some(p => p.username === username)) {
            this.showError('Username already exists');
            return;
        }

        const newProfile = {
            username,
            password,
            age,
            readingLevel,
            interests
        };

        this.profiles.push(newProfile);
        this.saveProfiles();
        this.currentUser = newProfile;
        localStorage.setItem('currentUser', JSON.stringify(newProfile));
        this.showProfile();
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('loginForm').reset();
        this.showLoginForm();
    }

    showProfile() {
        // Hide forms
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.add('hidden'));

        // Show profile
        const profileView = document.getElementById('profileView');
        profileView.classList.remove('hidden');

        // Update profile information
        document.getElementById('profileUsername').textContent = this.currentUser.username;
        document.getElementById('profileAge').textContent = this.currentUser.age;
        document.getElementById('profileReadingLevel').textContent = this.currentUser.readingLevel;
        
        const interestsContainer = document.getElementById('profileInterests');
        interestsContainer.innerHTML = this.currentUser.interests
            .map(interest => `<span class="interest-tag">${interest}</span>`)
            .join('');
    }

    showLoginForm() {
        document.getElementById('profileView').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('hidden'));
        this.switchTab('login');
    }

    checkLoggedInStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showProfile();
        }
    }

    showError(message) {
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const form = document.querySelector('.auth-form:not(.hidden)');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize profile manager when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});



document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('age').value;
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(cb => cb.value);
    
    // Store user data
    const userData = {
        username,
        age,
        interests,
        isLoggedIn: true
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Redirect to profile page
    window.location.href = 'profile.html';
});