document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('helpSearch');
    const helpArticles = document.querySelectorAll('.help-article');
    const topicCards = document.querySelectorAll('.topic-card');
    const readMoreLinks = document.querySelectorAll('.read-more');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            helpArticles.forEach(article => {
                const title = article.querySelector('h3').textContent.toLowerCase();
                const content = article.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    article.style.display = 'block';
                    article.style.animation = 'slideUp 0.5s ease-out';
                } else {
                    article.style.display = 'none';
                }
            });
        }, 300));
    }

    // Smooth scroll for topic links
    topicCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Read More functionality
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const article = this.closest('.help-article');
            const articleTitle = article.querySelector('h3').textContent;
            
            // Show article content in modal
            showArticleModal(articleTitle, getArticleContent(articleTitle));
        });
    });

    // Article content modal
    function showArticleModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal article-modal active';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <span class="close-btn">&times;</span>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Simulated article content
    function getArticleContent(title) {
        // This would typically fetch content from a database
        const content = {
            'Creating Your Account': `
                <h3>Steps to Create Your Account</h3>
                <ol>
                    <li>Click the "Sign Up" button in the top navigation</li>
                    <li>Enter your email address</li>
                    <li>Choose a secure password</li>
                    <li>Fill in your profile information</li>
                    <li>Select your reading preferences</li>
                </ol>
                <p>Note: If you're under 13, you'll need parent/guardian permission.</p>
            `,
            // Add more articles as needed
        };

        return content[title] || '<p>Content coming soon...</p>';
    }

    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Highlight active category in navigation
    function highlightActiveCategory() {
        const categories = document.querySelectorAll('.category-section');
        const navLinks = document.querySelectorAll('.topic-card');

        window.addEventListener('scroll', debounce(() => {
            let current = '';

            categories.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }

    // Initialize
    highlightActiveCategory();
});
