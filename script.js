document.addEventListener('DOMContentLoaded', function() {
    const cardStack = document.getElementById('card-stack');
    const likeBtn = document.getElementById('like');
    const passBtn = document.getElementById('pass');
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const matchScreen = document.getElementById('match-screen');
    const chatContainer = document.getElementById('chat-container');
    const startChatBtn = document.getElementById('start-chat-btn');
    const backToAppBtn = document.getElementById('back-to-app-btn');
    const messageArea = document.getElementById('message-area');

    let activeCard = null;
    let musicPlaying = false;
    let isInteracting = false;
    let startX, startY, moveX, moveY;

    // --- Music Controls ---
    musicToggle.addEventListener('click', toggleMusic);

    function toggleMusic() {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            backgroundMusic.play().catch(e => console.log("Autoplay was prevented."));
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        musicPlaying = !musicPlaying;
    }

    // --- Card Creation ---
    function createProfileCard() {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.style.backgroundImage = "url('./assets/Gallery1.JPG')"; // Main couple photo
        card.innerHTML = `
            <div class="profile-info">
                <h2>Nicky & Gina <i class="fa-solid fa-circle-check"></i></h2>
                <p>Getting married and starting our next adventure!</p>
                <div class="details-section">
                    <h3>The Wedding</h3>
                    <div class="detail-item"><i class="fa-solid fa-calendar-day"></i> Saturday, 31 October 2026</div>
                    <div class="detail-item"><i class="fa-solid fa-champagne-glasses"></i> Reception at MDC Hall, Wisma 76</div>
					<div class="detail-item"><i class="fa-solid fa-clock"></i> 19:00 - 21:00</div>
                </div>
            </div>
        `;
        cardStack.appendChild(card);
        activeCard = card;
        addCardEventListeners(activeCard);
    }

    // --- Card Interaction Logic ---
    function addCardEventListeners(card) {
        card.addEventListener('mousedown', startInteraction);
        card.addEventListener('touchstart', startInteraction, { passive: true });

        document.addEventListener('mousemove', onInteraction);
        document.addEventListener('touchmove', onInteraction, { passive: false });

        document.addEventListener('mouseup', endInteraction);
        document.addEventListener('touchend', endInteraction);
    }

    function startInteraction(e) {
        if (!activeCard) return;
        isInteracting = true;
        activeCard.classList.add('dragging');
        startX = e.pageX || e.touches[0].pageX;
        // Try to play music on first interaction
        if (!musicPlaying) {
            toggleMusic();
        }
    }

    function onInteraction(e) {
        if (!isInteracting || !activeCard) return;
        e.preventDefault();
        moveX = e.pageX || e.touches[0].pageX;
        const deltaX = moveX - startX;
        const rotation = deltaX * 0.1;
        
        activeCard.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    }

    function endInteraction() {
        if (!isInteracting || !activeCard) return;
        isInteracting = false;
        activeCard.classList.remove('dragging');
        
        const deltaX = moveX - startX;
        const decisionThreshold = window.innerWidth / 4;

        if (deltaX > decisionThreshold) {
            swipe('right');
        } else if (deltaX < -decisionThreshold) {
            swipe('left');
        } else {
            activeCard.style.transform = 'translateX(0) rotate(0)';
        }
        
        // Reset positions
        startX = 0;
        moveX = 0;
    }

    function swipe(direction) {
        if (!activeCard) return;
        const endX = direction === 'right' ? window.innerWidth : -window.innerWidth;
        const rotation = direction === 'right' ? 30 : -30;
        
        activeCard.style.transition = 'transform 0.5s ease';
        activeCard.style.transform = `translateX(${endX}px) rotate(${rotation}deg)`;
        
        activeCard.addEventListener('transitionend', () => activeCard.remove());
        activeCard = null;

        if (direction === 'right') {
            showMatchScreen();
        } else {
            // Can add logic for "passing" if needed, e.g., show a message
        }
    }

    likeBtn.addEventListener('click', () => swipe('right'));
    passBtn.addEventListener('click', () => swipe('left'));

    // --- Screen Transitions ---
    function showMatchScreen() {
        matchScreen.classList.remove('hidden');
    }

    startChatBtn.addEventListener('click', () => {
        matchScreen.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        populateChat();
    });

    backToAppBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        createProfileCard(); // Bring back the card
    });

    // --- Chat Population ---
    function populateChat() {
        messageArea.innerHTML = ''; // Clear previous messages
		messageArea.scrollTop = 0;
        
        addMessageToChat('system', 'You matched with Nicky & Gina on Jul 2, 2025', 0);
        addMessageToChat('received', 'We\'re so excited to invite you to our wedding!', 1000);
        addMessageToChat('received', createLocationMessage(), 2000);
        addMessageToChat('received', createRSVPMessage(), 3000);
        addMessageToChat('received', createGalleryMessage(), 4000);
    }

    function addMessageToChat(type, content, delay) {
		setTimeout(() => {
			const bubble = document.createElement('div');
			bubble.className = `message-bubble ${type}`;
			bubble.style.animationDelay = `${delay}ms`;
			
			if (typeof content === 'object') {
				bubble.appendChild(content);
			} else {
				bubble.innerHTML = content; // FIXED a typo here
			}
			messageArea.appendChild(bubble);
			// REMOVED: The line that scrolled to the bottom was here
		}, delay);
    }

    function createLocationMessage() {
        const content = document.createElement('div');
        content.innerHTML = `
            <h4>Event Location</h4>
            <p><strong>Reception:</strong> The MDC Hall, Wisma 76, West Jakarta</p>
            <div class="map-container">
                <iframe class="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.550965119208!2d106.7982013!3d-6.190786999999991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7ae2ebdc6f5%3A0x45d28c592dfff8b2!2sMDC%20Hall%20Jakarta!5e0!3m2!1sen!2sid!4v1751362233164!5m2!1sen!2sid" allowfullscreen="" loading="lazy"></iframe>
            </div>
        `;
        return content;
    }

    function createGalleryMessage() {
        const content = document.createElement('div');
        content.innerHTML = `
            <h4>Our Journey</h4>
            <p>A few of our favorite moments.</p>
            <div class="gallery-container">
                <img src="./assets/Gallery1-thumb.jpg" class="gallery-thumb" alt="Couple photo 1">
                <img src="./assets/Gallery2-thumb.jpg" class="gallery-thumb" alt="Couple photo 2">
                <img src="./assets/Gallery3-thumb.jpg" class="gallery-thumb" alt="Couple photo 3">
                <img src="./assets/Gallery4-thumb.jpg" class="gallery-thumb" alt="Couple photo 4">
            </div>
        `;
        return content;
    }

    function createRSVPMessage() {
        const content = document.createElement('div');
        content.innerHTML = `<h4>Will you be there?</h4>`;
        
        const form = document.createElement('form');
        form.id = 'rsvpForm';
        form.innerHTML = `
            <input type="text" name="name" placeholder="Your Name" required>
            <div class="radio-options">
                <label><input type="radio" name="attendance" value="accept" required> Accept</label>
                <label><input type="radio" name="attendance" value="decline" required> Decline</label>
            </div>
            <input type="number" name="guests" placeholder="Number of Guests" min="0" value="0">
            <textarea name="message" placeholder="Message for the couple..."></textarea>
            <button type="submit">Send RSVP</button>
        `;

        form.addEventListener('submit', handleRSVP);
        content.appendChild(form);
        return content;
    }
    
    async function handleRSVP(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const scriptURL = 'https://script.google.com/macros/s/AKfycbwc7qnIR3NnCc-jloZnxxGqU8NeVKrdefefsolk3BL-E5ZpByzak5qmKn6_d8wm7Ncaig/exec';
        const formData = new URLSearchParams(new FormData(form));

        try {
            const response = await fetch(scriptURL, { method: "POST", body: formData });
            const result = await response.json();
            
            if (result.status === 'success') {
                form.innerHTML = `<p><strong>Thank you!</strong> Your RSVP has been received.</p>`;
                loadGuestMessages();
            } else {
                form.innerHTML = `<p><strong>Error.</strong> Please try again.</p>`;
            }
        } catch(err) {
            form.innerHTML = `<p><strong>Network Error.</strong> Please try again.</p>`;
        }
    }
    
    function loadGuestMessages() {
        addMessageToChat('system', 'Loading messages from other guests...', 500);
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwc7qnIR3NnCc-jloZnxxGqU8NeVKrdefefsolk3BL-E5ZpByzak5qmKn6_d8wm7Ncaig/exec';

        fetch(SCRIPT_URL)
            .then(response => response.json())
            .then(messages => {
                let delay = 1000;
                messages.forEach(msg => {
                    if (msg.message && msg.message.trim() !== "") {
                       const messageContent = `"${msg.message}"<br><em>- ${msg.name}</em>`;
                       addMessageToChat('received', messageContent, delay);
                       delay += 1000;
                    }
                });
            }).catch(err => {
                addMessageToChat('system', 'Could not load guest messages.', 1000);
            });
    }

    // --- Initial Load ---
    createProfileCard();
});