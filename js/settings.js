class Settings {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'default';
        this.currentFontSize = localStorage.getItem('fontSize') || 'medium';
        this.animationsEnabled = localStorage.getItem('animations') !== 'false';
        
        this.initializeSettings();
        this.initializeEventListeners();
    }

    initializeSettings() {
        // Apply saved settings
        this.applyTheme(this.currentTheme);
        this.applyFontSize(this.currentFontSize);
        this.toggleAnimations(this.animationsEnabled);

        // Mark active settings
        this.markActiveTheme();
        this.markActiveFontSize();
        document.getElementById('animationToggle').checked = this.animationsEnabled;
    }

    initializeEventListeners() {
        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.markActiveTheme();
            });
        });

        // Font size selection
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.dataset.size;
                this.applyFontSize(size);
                this.markActiveFontSize();
            });
        });

        // Animation toggle
        document.getElementById('animationToggle').addEventListener('change', (e) => {
            this.toggleAnimations(e.target.checked);
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    applyFontSize(size) {
        document.documentElement.setAttribute('data-font-size', size);
        localStorage.setItem('fontSize', size);
        this.currentFontSize = size;
        
        // Apply font size classes
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${size}`);
    }

    toggleAnimations(enabled) {
        document.body.classList.toggle('animations-disabled', !enabled);
        localStorage.setItem('animations', enabled);
        this.animationsEnabled = enabled;
    }

    markActiveTheme() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
    }

    markActiveFontSize() {
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === this.currentFontSize);
        });
    }
}

// Initialize settings
document.addEventListener('DOMContentLoaded', () => {
    new Settings();
});
