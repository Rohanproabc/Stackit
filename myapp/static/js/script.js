class StackItApp {
    constructor() {
        this.currentUser = { id: 1, name: 'John Doe', role: 'User' };
        this.questions = this.loadSampleData();
        this.emojis = this.loadEmojiData();
        this.currentEmojiPicker = null;
        this.currentQuestion = null;
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

    // User dropdown events
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

    document.getElementById('questionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitQuestion();
    });

    // Answer submission event
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('submit-answer')) {
            e.preventDefault();
            this.submitAnswer();
        }
    });

    // Contact form (if on contact page)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm();
        });
    }

    // Notification events
    document.getElementById('notificationBell').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNotifications();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            this.setActiveFilter(e.target);
            this.filterQuestions(e.target.textContent);
        });
    });

    // Rich text editor events - FIXED with event delegation
    document.addEventListener('click', (e) => {
        if (e.target.closest('.editor-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.editor-btn');
            const command = btn.dataset.command;
            
            if (btn.classList.contains('emoji-btn')) {
                this.toggleEmojiPicker(btn);
            } else if (command) {
                this.executeEditorCommand(command, btn);
            }
        }
    });

    // Close modals and dropdowns when clicking outside
    window.addEventListener('click', (e) => {
        // Close modals when clicking outside
        if (e.target.classList.contains('modal')) {
            this.closeModal(e.target.id);
        }
        
        // Close notification dropdown
        if (!e.target.closest('.notification-bell') && !e.target.closest('.notification-dropdown')) {
            this.closeNotifications();
        }
        
        // Close user dropdown
        if (!e.target.closest('.user-avatar') && !e.target.closest('.user-dropdown')) {
            this.closeUserDropdown();
        }

        // Close emoji picker
        if (!e.target.closest('.emoji-btn') && !e.target.closest('.emoji-picker')) {
            this.closeAllEmojiPickers();
        }
    });

    // Add editor state monitoring for toolbar updates
    document.addEventListener('selectionchange', () => {
        document.querySelectorAll('.editor-toolbar').forEach(toolbar => {
            this.updateToolbarState(toolbar);
        });
    });

    // Keyboard shortcuts for rich text editor
    document.addEventListener('keydown', (e) => {
        // Only apply shortcuts when focused on editor content
        if (e.target.classList.contains('editor-content')) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        document.execCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        document.execCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        document.execCommand('underline');
                        break;
                }
            }
        }
        
        // Close emoji picker on Escape key
        if (e.key === 'Escape') {
            this.closeAllEmojiPickers();
        }
    });

    // Handle paste events in editor
    document.addEventListener('paste', (e) => {
        if (e.target.classList.contains('editor-content')) {
            // Allow default paste behavior but could add custom handling here
            setTimeout(() => {
                // Update toolbar state after paste
                const toolbar = e.target.closest('.rich-editor').querySelector('.editor-toolbar');
                if (toolbar) {
                    this.updateToolbarState(toolbar);
                }
            }, 10);
        }
    });

    // Handle focus events for editor
    document.addEventListener('focus', (e) => {
        if (e.target.classList.contains('editor-content')) {
            // Update toolbar state when editor gains focus
            const toolbar = e.target.closest('.rich-editor').querySelector('.editor-toolbar');
            if (toolbar) {
                this.updateToolbarState(toolbar);
            }
        }
    }, true);
}

    initRichEditor() {
        // Use event delegation for dynamically loaded editors
        document.addEventListener('click', (e) => {
            if (e.target.closest('.editor-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.editor-btn');
                const command = btn.dataset.command;
                
                if (btn.classList.contains('emoji-btn')) {
                    this.toggleEmojiPicker(btn);
                } else if (command) {
                    this.executeEditorCommand(command, btn);
                }
            }
        });

        // Initialize emoji pickers after DOM is ready
        setTimeout(() => {
            this.initEmojiPickers();
        }, 100);
    }

    executeEditorCommand(command, btn) {
        const editor = btn.closest('.rich-editor').querySelector('.editor-content');
        editor.focus();

        // Handle special commands
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
            // Execute standard commands
            document.execCommand(command, false, null);
        }

        // Update button active state for formatting commands
        this.updateToolbarState(btn.closest('.editor-toolbar'));
    }

    updateToolbarState(toolbar) {
        const formatButtons = ['bold', 'italic', 'strikethrough', 'justifyLeft', 'justifyCenter', 'justifyRight'];
        
        formatButtons.forEach(command => {
            const btn = toolbar.querySelector(`[data-command="${command}"]`);
            if (btn) {
                if (document.queryCommandState(command)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }

    initEmojiPickers() {
        document.querySelectorAll('.emoji-picker').forEach(picker => {
            this.setupEmojiPicker(picker);
        });
    }

    setupEmojiPicker(picker) {
        const categories = picker.querySelectorAll('.emoji-category');
        const emojiGrid = picker.querySelector('.emoji-grid');

        if (!categories.length || !emojiGrid) {
            console.error('Emoji picker structure incomplete');
            return;
        }

        // Set up category switching with event delegation
        categories.forEach(category => {
            category.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Update active category
                categories.forEach(cat => cat.classList.remove('active'));
                category.classList.add('active');
                
                // Load emojis for selected category
                const categoryName = category.dataset.category;
                this.loadEmojiCategory(emojiGrid, categoryName, picker);
            });
        });

        // Load default category (smileys)
        this.loadEmojiCategory(emojiGrid, 'smileys', picker);
    }


    loadEmojiCategory(grid, category, picker) {
        const emojis = this.emojis[category] || [];
        
        if (emojis.length === 0) {
            console.warn(`No emojis found for category: ${category}`);
            return;
        }
        
        grid.innerHTML = '';

        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.className = 'emoji-item';
            emojiBtn.textContent = emoji;
            emojiBtn.type = 'button'; // Prevent form submission
            
            emojiBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.insertEmoji(emoji, picker);
            });
            
            grid.appendChild(emojiBtn);
        });
    }

    toggleEmojiPicker(btn) {
        // Find the emoji picker in the same editor
        const editor = btn.closest('.rich-editor');
        const picker = editor.querySelector('.emoji-picker');
        
        if (!picker) {
            console.error('Emoji picker not found');
            return;
        }
        
        // Close other pickers first
        this.closeAllEmojiPickers();
        
        // Toggle current picker
        if (picker.classList.contains('show')) {
            picker.classList.remove('show');
            this.currentEmojiPicker = null;
        } else {
            picker.classList.add('show');
            this.currentEmojiPicker = picker;
            
            // Initialize if not already done
            if (!picker.dataset.initialized) {
                this.setupEmojiPicker(picker);
                picker.dataset.initialized = 'true';
            }
        }
    }

    closeAllEmojiPickers() {
        document.querySelectorAll('.emoji-picker').forEach(picker => {
            picker.classList.remove('show');
        });
        this.currentEmojiPicker = null;
    }

    insertEmoji(emoji, picker) {
        const editor = picker.closest('.rich-editor').querySelector('.editor-content');
        
        // Focus the editor
        editor.focus();
        
        // Insert emoji at cursor position
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        const emojiNode = document.createTextNode(emoji);
        range.insertNode(emojiNode);
        
        // Move cursor after emoji
        range.setStartAfter(emojiNode);
        range.setEndAfter(emojiNode);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Close emoji picker
        this.closeAllEmojiPickers();
    }

    loadEmojiData() {
        return {
            smileys: [
                '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
                '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
                '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
                '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'
            ],
            people: [
                '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
                '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
                '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛',
                '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️'
            ],
            nature: [
                '🌟', '⭐', '🌙', '☀️', '⛅', '🌤️', '🌦️', '🌧️',
                '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨',
                '🌪️', '🌫️', '🌈', '☔', '💧', '💦', '🌊', '🔥',
                '💥', '❄️', '💫', '⚡', '☄️', '💤', '💢', '💯'
            ],
            food: [
                '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙',
                '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿',
                '🧈', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐',
                '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗'
            ],
            activities: [
                '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
                '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
                '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
                '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿'
            ],
            travel: [
                '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
                '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵',
                '🚲', '🛴', '🛹', '🚁', '✈️', '🛩️', '🛫', '🛬',
                '🪂', '💺', '🚀', '🛸', '🚉', '🚊', '🚝', '🚞'
            ],
            objects: [
                '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾',
                '💿', '📀', '📱', '📞', '☎️', '📟', '📠', '📺',
                '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰',
                '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦'
            ],
            symbols: [
                '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
                '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
                '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
                '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈'
            ]
        };
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
                    <span><i class="fas fa-comment"></i> ${question.answers} answers</span>
                    <span><i class="fas fa-eye"></i> ${question.views} views</span>
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

        // Pass question author to renderAnswers
        this.renderAnswers(question.answers_data, question.author);
        this.currentQuestion = question; // Store current question for answer operations
        this.openModal('questionModal');
    }

    renderAnswers(answers, questionAuthor) {
        const answersList = document.getElementById('answersList');
        answersList.innerHTML = '';

        answers.forEach(answer => {
            const answerElement = document.createElement('div');
            answerElement.className = `answer-item ${answer.accepted ? 'accepted-answer' : ''}`;
            
            // Check if current user is the question author
            const isQuestionAuthor = this.currentUser.name === questionAuthor;
            const canAcceptAnswer = isQuestionAuthor && !answer.accepted;
            
            answerElement.innerHTML = `
                <div class="answer-meta">
                    <div>
                        <strong>${answer.author}</strong> • ${answer.timestamp}
                        ${answer.accepted ? '<span class="tag accepted-tag">✓ Accepted Answer</span>' : ''}
                    </div>
                    <div class="answer-actions">
                        <button class="vote-btn upvote" data-answer-id="${answer.id}">
                            <i class="fas fa-arrow-up"></i>
                            <span class="vote-count">${answer.votes}</span>
                        </button>
                        <button class="vote-btn downvote" data-answer-id="${answer.id}">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        ${canAcceptAnswer ? `<button class="accept-btn" data-answer-id="${answer.id}">Accept Answer</button>` : ''}
                    </div>
                </div>
                <div class="answer-content">${answer.content}</div>
            `;
            answersList.appendChild(answerElement);
        });

        // Add event listeners for voting and accepting answers
        this.bindAnswerEvents();
    }

    bindAnswerEvents() {
        // Vote buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const answerId = parseInt(btn.dataset.answerId);
                const voteType = btn.classList.contains('upvote') ? 'up' : 'down';
                this.handleAnswerVote(answerId, voteType, btn);
            });
        });

        // Accept buttons
        document.querySelectorAll('.accept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const answerId = parseInt(btn.dataset.answerId);
                this.acceptAnswer(answerId);
            });
        });
    }

    handleAnswerVote(answerId, voteType, buttonElement) {
        // Find the answer in current question
        const answer = this.currentQuestion.answers_data.find(a => a.id === answerId);
        if (!answer) return;

        // Update vote count
        if (voteType === 'up') {
            answer.votes += 1;
        } else {
            answer.votes -= 1;
        }

        // Update the vote count display
        const voteCountElement = buttonElement.querySelector('.vote-count');
        if (voteCountElement) {
            voteCountElement.textContent = answer.votes;
        }

        // Add visual feedback
        buttonElement.classList.add('voted');
        setTimeout(() => buttonElement.classList.remove('voted'), 300);
    }

    acceptAnswer(answerId) {
        // Find the answer in current question
        const answer = this.currentQuestion.answers_data.find(a => a.id === answerId);
        if (!answer) return;

        // Mark all answers as not accepted first
        this.currentQuestion.answers_data.forEach(a => a.accepted = false);
        
        // Mark this answer as accepted
        answer.accepted = true;

        // Re-render answers to show the accepted state
        this.renderAnswers(this.currentQuestion.answers_data, this.currentQuestion.author);

        // Show success message
        this.showNotification('Answer accepted successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
                filteredQuestions = this.questions.filter(q => q.views > 100);
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
    submitAnswer() {
        const answerContent = document.querySelector('#answerEditor .editor-content').innerHTML.trim();
        
        // Validate answer content
        if (!answerContent || answerContent === '') {
            this.showNotification('Please write an answer before submitting.', 'error');
            return;
        }

        // Create new answer object
        const newAnswer = {
            id: this.currentQuestion.answers_data.length + 1,
            content: answerContent,
            author: this.currentUser.name,
            timestamp: 'Just now',
            votes: 0,
            accepted: false
        };

        // Add answer to current question
        this.currentQuestion.answers_data.push(newAnswer);
        
        // Update answer count in the question
        this.currentQuestion.answers += 1;

        // Update the question in the main questions array
        const questionIndex = this.questions.findIndex(q => q.id === this.currentQuestion.id);
        if (questionIndex !== -1) {
            this.questions[questionIndex] = this.currentQuestion;
        }

        // Re-render answers to show the new answer
        this.renderAnswers(this.currentQuestion.answers_data, this.currentQuestion.author);

        // Clear the answer editor
        document.querySelector('#answerEditor .editor-content').innerHTML = '';

        // Show success notification
        this.showNotification('Answer posted successfully!', 'success');

        // Re-render questions list to update answer count
        this.renderQuestions();
    }

}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new StackItApp();
});
