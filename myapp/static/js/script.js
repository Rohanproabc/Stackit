class StackItApp {
    constructor() {
        this.currentUser = { id: 1, name: 'John Doe', role: 'User' };
        this.questions = this.loadSampleData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderQuestions();
        this.initRichEditor();
    }

    bindEvents() {
        // Modal events
        document.getElementById('askQuestionBtn').addEventListener('click', () => {
            this.openModal('askQuestionModal');
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal('questionModal');
        });

        document.getElementById('closeAskModal').addEventListener('click', () => {
            this.closeModal('askQuestionModal');
        });

        // Notification events
        document.getElementById('notificationBell').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotifications();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
            if (!e.target.closest('.notification-bell') && !e.target.closest('.notification-dropdown')) {
                this.closeNotifications();
            }
        });

        // Form submission
        document.getElementById('questionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitQuestion();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.filterQuestions(e.target.textContent);
            });
        });

            document.getElementById('userAvatar').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleUserDropdown();
    });

        document.getElementById('signUpBtn').addEventListener('click', () => {
            this.closeUserDropdown();
            this.openModal('signUpModal');
        });

        document.getElementById('loginBtn').addEventListener('click', () => {
            this.closeUserDropdown();
            this.openModal('loginModal');
        });

        // Auth modal events
        document.getElementById('closeSignUpModal').addEventListener('click', () => {
            this.closeModal('signUpModal');
        });

        document.getElementById('closeLoginModal').addEventListener('click', () => {
            this.closeModal('loginModal');
        });

        // Auth form switching
        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('signUpModal');
            this.openModal('loginModal');
        });

        document.getElementById('switchToSignUp').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('loginModal');
            this.openModal('signUpModal');
        });

        // Form submissions
        document.getElementById('signUpForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignUp();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Contact form (if on contact page)
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }

        // Close dropdowns when clicking outside
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.user-avatar') && !e.target.closest('.user-dropdown')) {
                this.closeUserDropdown();
            }
            // ... existing code ...
        });
    }

    initRichEditor() {
        document.querySelectorAll('.editor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                this.executeEditorCommand(command, btn);
            });
        });
    }

    executeEditorCommand(command, btn) {
        const editor = btn.closest('.rich-editor').querySelector('.editor-content');
        editor.focus();

        if (command === 'createLink') {
            const url = prompt('Enter URL:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command === 'insertImage') {
            const url = prompt('Enter image URL:');
            if (url) {
                document.execCommand('insertImage', false, url);
            }
        } else {
            document.execCommand(command, false, null);
        }
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('show');
    }

    closeUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.remove('show');
    }

    handleSignUp() {
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Here you would typically send the data to your backend
        console.log('Sign up attempt:', { name, email, password });
        
        // Simulate successful signup
        alert('Account created successfully! Please login.');
        this.closeModal('signUpModal');
        this.openModal('loginModal');
        
        // Reset form
        document.getElementById('signUpForm').reset();
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Here you would typically authenticate with your backend
        console.log('Login attempt:', { email, password, rememberMe });
        
        // Simulate successful login
        this.currentUser = { 
            id: 1, 
            name: email.split('@')[0], 
            email: email, 
            role: 'User' 
        };
        alert('Login successful!');
        this.closeModal('loginModal');
        
        // Reset form
        document.getElementById('loginForm').reset();
        
        // Update UI to show logged in state
        this.updateUserInterface();
    }

    handleContactForm() {
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;

        // Here you would typically send the message to your backend
        console.log('Contact form submission:', { name, email, subject, message });
        
        // Simulate successful submission
        alert('Thank you for your message! We\'ll get back to you soon.');
        
        // Reset form
        document.getElementById('contactForm').reset();
    }

    updateUserInterface() {
        // Update user avatar or show user name
        // This is where you'd update the UI to reflect the logged-in state
        console.log('User interface updated for:', this.currentUser.name);
    }
        


    loadSampleData() {
        return [
            {
                id: 1,
                title: "How to implement JWT authentication in React?",
                description: "I'm building a React application and need to implement JWT authentication. What's the best approach for storing and managing JWT tokens?",
                author: "Alice Johnson",
                timestamp: "2 hours ago",
                tags: ["React", "JWT", "Authentication"],
                votes: 5,
                answers: 3,
                views: 127,
                answers_data: [
                    {
                        id: 1,
                        content: "You can store JWT tokens in localStorage or sessionStorage. Here's a basic implementation...",
                        author: "Bob Smith",
                        timestamp: "1 hour ago",
                        votes: 3,
                        accepted: true
                    }
                ]
            },
            {
                id: 2,
                title: "Best practices for React component optimization",
                description: "What are the most effective ways to optimize React components for better performance?",
                author: "Charlie Brown",
                timestamp: "4 hours ago",
                tags: ["React", "Performance", "Optimization"],
                votes: 8,
                answers: 2,
                views: 89,
                answers_data: []
            },
            {
                id: 3,
                title: "How to handle async operations in Redux?",
                description: "I'm struggling with handling asynchronous operations in Redux. Should I use Redux Thunk or Redux Saga?",
                author: "Diana Prince",
                timestamp: "1 day ago",
                tags: ["Redux", "Async", "JavaScript"],
                votes: 12,
                answers: 5,
                views: 234,
                answers_data: []
            }
        ];
    }

    renderQuestions() {
        const questionsList = document.getElementById('questionsList');
        questionsList.innerHTML = '';

        this.questions.forEach(question => {
            const questionCard = this.createQuestionCard(question);
            questionsList.appendChild(questionCard);
        });
    }

    createQuestionCard(question) {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-header">
                <div>
                    <h3 class="question-title">${question.title}</h3>
                    <div class="question-meta">
                        Asked by <strong>${question.author}</strong> • ${question.timestamp}
                    </div>
                </div>
                <div class="question-stats">
                    <span><i class="fas fa-arrow-up"></i> ${question.votes}</span>
                    <span><i class="fas fa-comment"></i> ${question.answers}</span>
                    <span><i class="fas fa-eye"></i> ${question.views}</span>
                </div>
            </div>
            <div class="question-tags">
                ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        card.addEventListener('click', () => {
            this.openQuestionDetail(question);
        });

        return card;
    }

    openQuestionDetail(question) {
        document.getElementById('questionTitle').textContent = question.title;
        document.getElementById('questionAuthor').textContent = question.author;
        document.getElementById('questionTime').textContent = question.timestamp;
        document.getElementById('questionDescription').innerHTML = question.description;
        
        const tagsContainer = document.getElementById('questionTags');
        tagsContainer.innerHTML = question.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        this.renderAnswers(question.answers_data);
        this.openModal('questionModal');
    }

    renderAnswers(answers) {
        const answersList = document.getElementById('answersList');
        answersList.innerHTML = '';

        answers.forEach(answer => {
            const answerElement = document.createElement('div');
            answerElement.className = `answer-item ${answer.accepted ? 'accepted-answer' : ''}`;
            answerElement.innerHTML = `
                <div class="answer-meta">
                    <div>
                        <strong>${answer.author}</strong> • ${answer.timestamp}
                        ${answer.accepted ? '<span class="tag" style="background: #28a745; color: white;">Accepted</span>' : ''}
                    </div>
                    <div class="answer-actions">
                        <button class="vote-btn upvote">
                            <i class="fas fa-arrow-up"></i>
                            <span>${answer.votes}</span>
                        </button>
                        ${!answer.accepted && this.currentUser.role !== 'Guest' ? 
                            '<button class="accept-btn">Accept</button>' : ''}
                    </div>
                </div>
                <div class="answer-content">${answer.content}</div>
            `;
            answersList.appendChild(answerElement);
        });
    }

    submitQuestion() {
        const title = document.getElementById('questionTitleInput').value;
        const description = document.querySelector('#questionEditor .editor-content').innerHTML;
        const tags = document.getElementById('questionTagsInput').value.split(',').map(tag => tag.trim());

        const newQuestion = {
            id: this.questions.length + 1,
            title,
            description,
            author: this.currentUser.name,
            timestamp: 'Just now',
            tags,
            votes: 0,
            answers: 0,
            views: 0,
            answers_data: []
        };

        this.questions.unshift(newQuestion);
        this.renderQuestions();
        this.closeModal('askQuestionModal');
        this.resetForm();
    }

    resetForm() {
        document.getElementById('questionForm').reset();
        document.querySelector('#questionEditor .editor-content').innerHTML = '';
    }

    setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    filterQuestions(filter) {
        let filteredQuestions = [...this.questions];
        
        switch(filter) {
            case 'Unanswered':
                filteredQuestions = this.questions.filter(q => q.answers === 0);
                break;
            case 'Popular':
                filteredQuestions = this.questions.filter(q => q.votes > 5);
                break;
            default:
                filteredQuestions = this.questions;
        }

        this.renderFilteredQuestions(filteredQuestions);
    }

    renderFilteredQuestions(questions) {
        const questionsList = document.getElementById('questionsList');
        questionsList.innerHTML = '';

        questions.forEach(question => {
            const questionCard = this.createQuestionCard(question);
            questionsList.appendChild(questionCard);
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // Mark notifications as read
            document.getElementById('notificationCount').style.display = 'none';
        }
    }

    closeNotifications() {
        document.getElementById('notificationDropdown').style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new StackItApp();
});