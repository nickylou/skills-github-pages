let touchStartX = 0;
let touchEndX = 0;
let currentPage = 0;
let firstOpen = 0; 

const swipeThreshold = 50; // Minimum swipe distance in pixels

function goToNextPage() {
	showPage(currentPage + 1);
}

function goToPrevPage() {
	showPage(currentPage - 1);
}
    
function showPage(index) {
	// Validate page index
	if (index < 0 || index >= pages.length) return;
	
	// If same page, do nothing
	if (index === currentPage && firstOpen > 0) return;
	
	firstOpen = 1;
	
	const direction = index > currentPage ? 'left' : 'right';
	
	// Lock scroll position before animation
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
	
	// Add exit animation to current page
    const currentActive = pages[currentPage];
    currentActive.classList.add(`swipe-${direction}`);
    currentActive.classList.remove('active');
	
	// Prepare new page
    const newPage = pages[index];
    newPage.style.display = 'flex';
    newPage.classList.add(`swipe-from-${direction === 'left' ? 'right' : 'left'}`);
    newPage.classList.add('active');
	
	// After animation completes
    setTimeout(() => {
        currentActive.classList.remove(`swipe-${direction}`);
        newPage.classList.remove(`swipe-from-${direction === 'left' ? 'right' : 'left'}`);
        
		// Restore scroll position
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
		
        currentPage = index;
        updatePageIndicators();
        invitationContainer.classList.add('visible');
		adjustContentForMobile();
    }, 500);
}	

function createParallaxEffect() {
    document.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax-layer').forEach(layer => {
            const depth = layer.dataset.depth || 1;
            const movement = -(scrolled * depth * 0.1);
            layer.style.transform = `translateY(${movement}px)`;
        });
    });
}

function updatePageIndicators() {
	const indicators = document.querySelectorAll('.page-indicators span');
    indicators.forEach((indicator, index) => {
        indicator.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.3)' },
            { transform: 'scale(1)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
        indicator.classList.toggle('active', index === currentPage);
    });
}
	
function setupSwipeNavigation(container) {
    let touchStartX = 0;
	let touchStartTime = 0;
    let isDragging = false;
    const minSwipeDistance = 50; // Minimum swipe distance in pixels
    const maxSwipeTime = 300; // Maximum time for a swipe gesture in ms
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
		touchStartTime = Date.now();
        isDragging = true;
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
		const currentX = e.touches[0].clientX;
        const deltaX = currentX - touchStartX;
        
        // Show hint based on drag direction
        if (deltaX > 10) {
            container.classList.add('swipe-hint-right');
            container.classList.remove('swipe-hint-left');
        } else if (deltaX < -10) {
            container.classList.add('swipe-hint-left');
            container.classList.remove('swipe-hint-right');
        }
		
		// Prevent vertical scrolling during horizontal swipe
        if (Math.abs(deltaX) > 10) {
            e.preventDefault();
        }
		
    }, { passive: false });
    
    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
		const swipeTime = Date.now() - touchStartTime;
        
        // Only register as swipe if:
        // 1. Moved enough distance
        // 2. Was fast enough
        // 3. Was primarily horizontal
        if (Math.abs(deltaX) > minSwipeDistance && swipeTime < maxSwipeTime) {
            if (deltaX < 0 && currentPage < pages.length - 1) {
                goToNextPage();
            } else if (deltaX > 0 && currentPage > 0) {
                goToPrevPage();
            }
        }
    }, { passive: true });
}

function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    
    // Right to left swipe (next page)
    if (deltaX < -swipeThreshold) {
        goToNextPage();
    }
    // Left to right swipe (previous page)
    else if (deltaX > swipeThreshold) {
        goToPrevPage();
    }
}

// Page creation functions 
function createMainInvitationPage() {
	const page = document.createElement('div');
	page.className = 'invitation-page main-invitation';

	page.innerHTML = `
        <div class="invitation-card">
            <div class="invitation-border">
                <div class="invitation-content">                    
                        <h1 class="couple-names">Gina & Nicky</h1>
                        <div class="divider"></div>
                        <p class="invitation-text">Together with their families</p>
                        <h2 class="invitation-header">Request the pleasure of your company</h2>
                        <p class="invitation-text">as they exchange vows and begin their new life together</p>
                    <div class="main-grid">
						<div class="main-grid-cell">
							<div class="ceremony-details">
								<div class="detail-item">
									<i class="fa-solid fa-vihara"></i>
									<h3>Ceremony</h3>
									<p>Vihara Dhamma Sukha Pluit</p>
								</div>
								<div class="detail-item">
									<i class="fas fa-clock"></i>
									<h3>Date & Time</h3>
									<p>31 October 2026<br>10:00 - 12:00</p>
								</div>
							</div>
						</div>
						<div class="main-grid-divider">
						</div>
						<div class="main-grid-cell">
							<div class="reception-details">
								<div class="detail-item">
									<i class="fa-solid fa-champagne-glasses"></i>
									<h3>Reception</h3>
									<p>The Royal Jade Restaurant</p>
								</div>
								<div class="detail-item">
									<i class="fas fa-clock"></i>
									<h3>Date & Time</h3>
									<p>31 October 2026<br>19:00 - 21:00</p>
								</div>
							</div>
						</div>
					</div>
                </div>
            </div>
        </div>
    `;

return page;
}

function createPhotoGalleryPage() {
	const page = document.createElement('div');
	page.className = 'invitation-page photo-gallery';
	
	page.innerHTML = `
        <div class="invitation-card">
            <div class="invitation-border">
                <div class="invitation-content">
                    <h1 class="page-title">Our Journey</h1>
                    <div class="divider"></div>
                    <p class="invitation-text">Click on photos to view larger</p>
                    
                    <div class="photo-gallery">
                        <div class="gallery-grid">
                            <div class="thumbnail-container">
                                <img src="./assets/Gallery1-thumb.jpg" class="gallery-thumbnail" 
                                     alt="Couple photo 1" data-fullsize="./assets/Gallery1.JPG">
                            </div>
                            <div class="thumbnail-container">
                                <img src="./assets/Gallery2-thumb.jpg" class="gallery-thumbnail" 
                                     alt="Couple photo 2" data-fullsize="./assets/Gallery2.JPG">
                            </div>
                            <div class="thumbnail-container">
                                <img src="./assets/Gallery3-thumb.jpg" class="gallery-thumbnail" 
                                     alt="Couple photo 3" data-fullsize="./assets/Gallery3.JPG">
                            </div>
                            <div class="thumbnail-container">
                                <img src="./assets/Gallery4-thumb.jpg" class="gallery-thumbnail" 
                                     alt="Couple photo 4" data-fullsize="./assets/Gallery4.JPG">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Lightbox HTML -->
                    <div class="lightbox" id="galleryLightbox" style="display: none;">
                        <span class="lightbox-close">&times;</span>
                        <img class="lightbox-content" id="lightboxImage">
                        <div class="lightbox-caption"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Return the page immediately
    return page;
}

function createRSVPPage() {
	const page = document.createElement('div');
	page.className = 'invitation-page rsvp-page';
	
	page.innerHTML = `
        <div class="invitation-card">
            <div class="invitation-border">
                <div class="invitation-content">
                    <div class="rsvp-container">
						<h2 class="rsvp-title">RSVP</h2>
						<form id="rsvpForm" class="rsvp-form">
							<!-- Name Input -->
							<div class="form-group">
							  <label for="name">Full Name</label>
							  <input type="text" id="name" name="name" required 
									 class="form-input" placeholder="Your full name">
							</div>

							<!-- Attendance Radio Group -->
							<div class="form-group radio-group">
							  <p class="radio-label">Will you attend?</p>
							  <div class="radio-options">
								<label class="radio-option">
								  <input type="radio" name="attendance" value="accept" required>
								  <span class="custom-radio"></span>
								  <span class="option-text">Joyfully Accept</span>
								</label>
								
								<label class="radio-option">
								  <input type="radio" name="attendance" value="decline" required>
								  <span class="custom-radio"></span>
								  <span class="option-text">Regretfully Decline</span>
								</label>
							  </div>
							</div>

							<!-- Guests Input -->
							<div class="form-group">
							  <label for="guests">Number of Guests</label>
							  <input type="number" id="guests" name="guests" min="0" value="0"
									 class="form-input" placeholder="0">
							</div>

							<!-- Message Textarea -->
							<div class="form-group">
							  <label for="message">Message for the Couple</label>
							  <textarea id="message" name="message" class="form-textarea"
										placeholder="Share your warm wishes..."></textarea>
							</div>

							<button type="submit" class="submit-btn">
							  Send RSVP
							  <i class="fas fa-paper-plane"></i>
							</button>
						</form>
					</div>
                </div>
            </div>
        </div>
    `;
	
	return page;
}

function initializeRSVPForm() {
  const form = document.querySelector('.rsvp-form');
  const submitBtn = form.querySelector('.submit-btn');

  const scriptURL = 'https://script.google.com/macros/s/AKfycbwc7qnIR3NnCc-jloZnxxGqU8NeVKrdefefsolk3BL-E5ZpByzak5qmKn6_d8wm7Ncaig/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    const formData = new URLSearchParams();
    formData.append("name", form.name.value.trim());
    formData.append("attendance", form.attendance.value);
    formData.append("guests", form.guests.value);
    formData.append("message", form.message.value.trim());

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success') {
        showToast("Thank you for your RSVP!");

        // Replace RSVP page with message board
        const currentRSVPPage = pages[2];
        const messageBoardPage = createMessageBoardPage();

        currentRSVPPage.replaceWith(messageBoardPage);
        pages[2] = messageBoardPage;

        messageBoardPage.classList.add('active');
        messageBoardPage.style.display = 'flex';

        console.log("Message board page loaded", messageBoardPage);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast("Error: " + (result.message || "Something went wrong."), true);
        console.log(result.message)
      }

    } catch (err) {
      showToast("Network error. Please try again.", true);
    } finally {
      submitBtn.disabled = false;
    }
  });
}


function createMessageBoardPage() {
    const page = document.createElement('div');
    page.className = 'invitation-page message-board-page';
    
    page.innerHTML = `
        <div class="invitation-card">
            <div class="invitation-border">
                <div class="invitation-content">
                    <h1 class="page-title">Guest Messages</h1>
                    <div class="divider"></div>
                    <div class="messages-container">
                        <div class="loading-messages">
                            <div class="loader-spinner small"></div>
                            Loading messages...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load messages after page is created
    setTimeout(() => loadMessages(page), 0);
    return page;
}

function loadMessages(page) {
    const container = page.querySelector('.messages-container');
    const loading = page.querySelector('.loading-messages');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwc7qnIR3NnCc-jloZnxxGqU8NeVKrdefefsolk3BL-E5ZpByzak5qmKn6_d8wm7Ncaig/exec';

    // Show loading state
    loading.innerHTML = `
        <div class="loader-spinner small"></div>
        Loading heartfelt messages...
    `;

    // Add timeout for slow connections
    const timeout = setTimeout(() => {
        loading.innerHTML = 'Messages are taking longer to arrive...<br>Like a carefully written love letter';
    }, 5000);

    // Fetch messages with proper error handling
    fetch(SCRIPT_URL)
		.then(response => response.json())
		.then(messages => {
		  loading.remove();
		  messages.forEach(msg => {
			if (msg.message && msg.message.trim() !== "") {
			  const messageEl = document.createElement('div');
			  messageEl.className = 'message-card';
			  messageEl.innerHTML = `
				<div class="message-content">"${msg.message}"</div>
				<div class="message-author">- ${msg.name}</div>
			  `;
			  container.appendChild(messageEl);
			}
		  });
		})
		.catch(error => {
		  loading.textContent = 'Could not load messages.';
	});
}

// Helper function to format dates
function formatDate(timestamp) {
    const options = { 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(timestamp).toLocaleDateString('en-US', options);
}

function createLocationPage() {
    const page = document.createElement('div');
    page.className = 'invitation-page location-page';

    page.innerHTML = `
      <div class="invitation-card">
        <div class="invitation-border">
          <div class="invitation-content">
            <h1 class="page-title">Location</h1>
            <div class="divider"></div>   
            <div class="location-grid">
              <div class="grid-cell">
                  <h3>Wedding ceremony</h3>
                  <p>Vihara Pluit Dharma Sukha</p>
				  <p>Jl. Pluit Permai 1 No.26 2, RT.2/RW.4, Kec. Penjaringan, Jkt Utara</p>
              </div>
              <div class="grid-cell">
					<h3>Directions</h3>
					<div class="map-container">
						<div class="map-ratio-keeper">
							<iframe class="map" 
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7934.232846598874!2d106.78868239999998!3d-6.115025699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1dbe6c547983%3A0x381f9be67d34fca1!2sVihara%20Pluit%20Dharma%20Sukha!5e0!3m2!1sen!2sau!4v1746715676106!5m2!1sen!2sau"
									allowfullscreen=""
									loading="lazy">
							</iframe>
						</div>
					</div>
              </div>
              <div class="grid-cell">
                  <h3>Wedding reception</h3>
                  <p>The Royal Jade Restaurant</p>
				  <p>Komplek Ruko Seasons City, Jl. Kali Anyar IX No.1, RT.13/RW.1, Kec. Tambora, Jkt Barat</p>
              </div>
              <div class="grid-cell">
					<h3>Directions</h3>
					<div class="map-container">
						<div class="map-ratio-keeper">
							<iframe class="map" 
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.834157018368!2d106.7972135!3d-6.1529605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f75b466dc76b%3A0x3f2e4355d559aa84!2sThe%20Royal%20Jade%20Restaurant%20%26%20Function%20Hall!5e0!3m2!1sen!2sau!4v1746716002414!5m2!1sen!2sau"
									allowfullscreen=""
									loading="lazy">
							</iframe>
						</div>
					</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return page;
}

function adjustContentForMobile() {
    if (window.innerWidth <= 768) {
        const content = document.querySelector('.invitation-content');
        if (content) {
            const viewportHeight = window.innerHeight;
            const contentHeight = content.scrollHeight;
            
            if (contentHeight > viewportHeight * 0.9) {
                const scale = (viewportHeight * 0.9) / contentHeight;
                content.style.transform = `scale(${Math.min(scale, 1)})`;
                content.style.transformOrigin = 'top center';
            }
        }
    }
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('touchstart', function initAudio() {
    // Create and immediately pause audio
    const dummy = new Audio();
    dummy.play().then(() => dummy.pause());
    
    // Remove this after first touch
    document.body.removeEventListener('touchstart', initAudio);
    }, {once: true});

    // Show loading animation initially
    const loader = document.createElement('div');
	const navArrows = document.createElement('div');
	
    loader.className = 'loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
	
	// Hide loader after everything is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });
    
    // Music toggle functionality
    const musicToggle = document.getElementById('musicToggle');
    const envelopeMusic = document.getElementById('envelopeMusic');
    let musicPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        if (musicPlaying) {
            envelopeMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            envelopeMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        musicPlaying = !musicPlaying;
    });
	
	navArrows.className = 'nav-arrows hidden';
	navArrows.style.display = 'none'; // Ensure it's hidden
	navArrows.style.opacity = '0'; // Start transparent
	navArrows.innerHTML = `
		<div class="nav-arrow prev" aria-label="Previous page">
			<i class="fas fa-chevron-left"></i>
		</div>
		<div class="nav-arrow next" aria-label="Next page">
			<i class="fas fa-chevron-right"></i>
		</div>
	`;
	
	
	navArrows.querySelector('.prev').addEventListener('click', goToPrevPage);
	navArrows.querySelector('.next').addEventListener('click', goToNextPage);
	
	window.addEventListener('resize', () => {
		if (container.classList.contains('envelope-open')) {
			if (window.innerWidth >= 769) {
				navArrows.style.display = 'block';
			} else {
				navArrows.style.display = 'none';
			}
		}
	});
	
	if (window.innerWidth >= 769) {
    navArrows.style.display = 'block';
	}
	
	document.body.appendChild(navArrows);
	
	document.addEventListener('keydown', (e) => {
		if (window.innerWidth >= 769) {
			if (e.key === 'ArrowLeft') goToPrevPage();
			if (e.key === 'ArrowRight') goToNextPage();
		}
	});
    
    // Create envelope with SVG
    const envelope = createSVGEnvelope();
    const container = document.querySelector('.container');
	
    container.appendChild(envelope);
	
    
    const invitationContainer = document.createElement('div');
    invitationContainer.className = 'invitation-container';
    invitationContainer.id = 'invitationContainer';
	invitationContainer.style.display = 'none'; // Start hidden
	invitationContainer.style.opacity = '0'; // Start transparent
	invitationContainer.style.backgroundColor = '#fff9f0';
    container.appendChild(invitationContainer);
	
	setupSwipeNavigation(invitationContainer);
    
    // Create invitation pages
    pages = [
        createMainInvitationPage(),
		createLocationPage(),        
        createRSVPPage(),
		createPhotoGalleryPage()        
    ];
	
	// Add lightbox event handlers after all pages are created and added to DOM
    setTimeout(() => {
        const galleryPage = pages[3]; // Assuming gallery is second page
        if (galleryPage) {
            const thumbnails = galleryPage.querySelectorAll('.gallery-thumbnail');
            const lightbox = galleryPage.querySelector('#galleryLightbox');
            const lightboxImg = galleryPage.querySelector('#lightboxImage');
            const lightboxCaption = galleryPage.querySelector('.lightbox-caption');
            const closeBtn = galleryPage.querySelector('.lightbox-close');
            
            if (thumbnails && lightbox && lightboxImg && lightboxCaption && closeBtn) {
                thumbnails.forEach(thumb => {
                    thumb.addEventListener('click', () => {
                        lightboxImg.src = thumb.dataset.fullsize;
                        lightboxCaption.textContent = thumb.alt;
                        lightbox.style.display = 'flex';
                    });
                });
                
                closeBtn.addEventListener('click', () => {
                    lightbox.style.display = 'none';
                });
                
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        lightbox.style.display = 'none';
                    }
                });
            }
        }
    }, 0);

    pages[0].classList.add('active');
    pages.forEach(page => {
        invitationContainer.appendChild(page);
    });
    
    
    // Add page indicators
    const pageIndicators = document.createElement('div');
	pageIndicators.className = 'page-indicators hidden';
	pageIndicators.style.opacity = '0';
	pageIndicators.style.display = 'none';
    
    pages.forEach((_, index) => {
		const indicator = document.createElement('span');
		indicator.dataset.page = index;
		indicator.addEventListener('click', () => showPage(index));
		pageIndicators.appendChild(indicator);
	});
    
    // Add indicators to body instead of invitationContainer
	document.body.appendChild(pageIndicators);
	
	// Fade in indicators after envelope opens
	setTimeout(() => {
		pageIndicators.style.opacity = '1';
		pageIndicators.style.transition = 'opacity 0.5s ease';
	}, 1000);
    
	setTimeout(() => {
		envelope.classList.add('jiggle');
	}, 2000);
	
    // Envelope click event
    envelope.addEventListener('click', function() {
        // Play music when envelope is opened
        envelopeMusic.currentTime = 0;
        envelopeMusic.play();
        musicPlaying = true;
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';

		this.classList.remove('jiggle');
		this.classList.add('open');
		
		// Show invitation container
		invitationContainer.style.display = 'block';
		invitationContainer.style.opacity = '0';
	
        container.classList.add('envelope-open');
    
		setTimeout(() => {
			invitationContainer.style.opacity = '1';
			
			// Show navigation elements
			navArrows.style.display = 'block';
			navArrows.style.opacity = '1';
			pageIndicators.style.display = 'flex';
			pageIndicators.style.opacity = '1';
			
			initializeRSVPForm();

		}, 500);
	
    });
    

    
    // SVG Envelope Creation Function
    function createSVGEnvelope() {
		const envelope = document.createElement('div');
		envelope.className = 'envelope';
		envelope.id = 'envelope';
		
		// Create SVG element
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 512 512');
		
		// Create SVG paths with more elegant curves
		const paths = [
			{ 
				class: 'envelope-back', 
				d: 'M480,128H32c-17.7,0-32,14.3-32,32v256c0,17.7,14.3,32,32,32h448c17.7,0,32-14.3,32-32V160C512,142.3,497.7,128,480,128z',
				filter: 'url(#envelopeShadow)'
			},
			{ 
				class: 'envelope-front', 
				d: 'M480,128c0,0-192,176-224,208S32,128,32,128H480z',
				filter: 'url(#frontHighlight)'
			},
			{ 
				class: 'envelope-flap', 
				d: 'M480,128c0,0-224,180-224,180S32,128,32,128H480z',
				filter: 'url(#flapShadow)'
			},
			{ 
				class: 'envelope-seal', 
				d: 'M256,300c-22,0-40-18-40-40s18-40,40-40s40,18,40,40S278,300,256,300z',
				filter: 'url(#sealGlow)'
			},
			{
				class: 'envelope-crease',
				d: 'M256,128L256,300',
				stroke: 'rgba(90,62,54,0.2)',
				'stroke-width': '0.5',
				'stroke-dasharray': '3,2'
			}
		];
		
		// Add filter definitions for sophisticated effects
		const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
		
		// Shadow filter for depth
		const shadowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
		shadowFilter.id = 'envelopeShadow';
		shadowFilter.innerHTML = `
			<feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="rgba(90,62,54,0.3)"/>
		`;
		defs.appendChild(shadowFilter);
		
		// Highlight filter for front
		const frontFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
		frontFilter.id = 'frontHighlight';
		frontFilter.innerHTML = `
			<feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
			<feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.5" 
							   specularExponent="20" lighting-color="#fff9f0" result="spec">
				<fePointLight x="50" y="100" z="200"/>
			</feSpecularLighting>
			<feComposite in="spec" in2="SourceGraphic" operator="in" result="comp"/>
		`;
		defs.appendChild(frontFilter);
		
		// Seal glow filter
		const sealFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
		sealFilter.id = 'sealGlow';
		sealFilter.innerHTML = `
			<feGaussianBlur stdDeviation="3" result="blur"/>
			<feComposite in="SourceGraphic" in2="blur" operator="over"/>
		`;
		defs.appendChild(sealFilter);
		
		const flapShadow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
		flapShadow.id = 'flapShadow';
		flapShadow.innerHTML = `
			<feDropShadow 
				dx="0" 
				dy="3" 
				stdDeviation="2" 
				flood-color="rgba(90,62,54,0.2)"
				flood-opacity="0.5"/>
		`;
		defs.appendChild(flapShadow);
		
		svg.appendChild(defs);
		
		// Create paths
		paths.forEach(pathData => {
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('class', pathData.class);
			path.setAttribute('d', pathData.d);
			if (pathData.filter) path.setAttribute('filter', pathData.filter);
			svg.appendChild(path);
		});
		
		// Add decorative corner elements
		const corners = [
			{ class: 'envelope-corner tl', d: 'M32,128c0,0,20-10,40-10s40,10,40,10' },
			{ class: 'envelope-corner tr', d: 'M480,128c0,0-20-10-40-10s-40,10-40,10' }
		];
		
		corners.forEach(corner => {
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('class', corner.class);
			path.setAttribute('d', corner.d);
			path.setAttribute('stroke-linecap', 'round');
			svg.appendChild(path);
		});
		
		// Create envelope text with more elegant styling
		const envelopeText = document.createElement('div');
		envelopeText.className = 'envelope-text';
		envelopeText.innerHTML = `
			<h2>You're invited</h2>
			<div class="envelope-divider"></div>
			<p>Click to open</p>
		`;
		
		// Append elements to envelope
		envelope.appendChild(svg);
		envelope.appendChild(envelopeText);
		
		return envelope;
	}
    
 
    
    // Add dynamic styles
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        /* Envelope SVG Styles */
        .envelope {
            width: 500px;
            height: 300px;
            position: relative;
            cursor: pointer;
            margin: 0 auto;
        }
        .envelope svg {
            width: 100%;
            height: 100%;
        }
        .envelope-back {
            fill: #e8c4c4;
            transition: all 0.5s ease;
        }
        .envelope-front {
            fill: #d8a8a8;
            transition: all 0.5s ease;
        }
        .envelope-flap {
            fill: #e8c4c4;
            transform-origin: top center;
            transition: all 0.5s ease;
        }
		
		.envelope-main-fold {
			fill: none;
			stroke: #b38b8b; /* Darker pink for better contrast */
			stroke-width: 2px;
			stroke-dasharray: 6,4; /* Longer dashes */
			opacity: 0.9;
			transition: all 0.3s ease;
		}
		
		.envelope-secondary-fold {
			fill: none;
			stroke: #d8a8a8; /* Matching envelope color */
			stroke-width: 1.5px;
			stroke-dasharray: 3,3; /* Shorter dashes */
			opacity: 0.7;
			transition: all 0.3s ease;
		}
		
		.envelope.open .envelope-main-fold,
		.envelope.open .envelope-secondary-fold {
			opacity: 0;
			transform: translateY(-10px); /* Slight upward fade */
		}
	
        .envelope.open .envelope-flap {
            transform: rotateX(180deg);
        }
        .envelope.open .envelope-front {
            opacity: 0;
        }
        .envelope-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 10;
            color: #5a3e36;
            font-family: 'Playfair Display', serif;
            pointer-events: none;
        }
        
        /* Page indicators */
        .page-indicators {
            position: fixed; /* Changed from absolute to fixed */
			bottom: 20px;
			left: 0;
			right: 0;
			display: flex;
			justify-content: center;
			gap: 10px;
			z-index: 1000;
			pointer-events: none; /* Allows clicks to pass through when inactive */
			transform: translateZ(0); /* Hardware acceleration */
        }
        .page-indicators span {
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: #e8c4c4;
			cursor: pointer;
			transition: all 0.3s;
			pointer-events: auto; /* Allows clicks on indicators */
			transform: translateZ(0); /* Hardware acceleration */
			will-change: transform; /* Optimizes animation */
        }
        .page-indicators span.active {
			background: #d8a8a8;
			transform: scale(1.2) translateZ(0);
        }
		.invitation-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff9f0;
        z-index: 100;
        overflow-y: auto;
        transition: opacity 0.5s ease;
		}
		
		.invitation-container.visible {
        opacity: 1;
		}
		
		/* Invitation Card Styles */
.invitation-card {
    background: #fff9f0;
    padding: var(--invitation-padding);
    width: 90%;
    max-width: var(--card-max-width);
    margin: 0 auto;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.invitation-border {
    border: 2px solid #d8a8a8;
    padding: var(--invitation-padding);
    position: relative;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
	max-height: 100%
}

.invitation-content {
    max-width: 500px;
    margin: 0 auto;
}

.couple-names {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3rem);
    color: #5a3e36;
    margin: 0 0 20px 0;
    letter-spacing: 2px;
}

.divider {
    width: 100px;
    height: 1px;
    background: #d8a8a8;
    margin: 20px auto;
}

.invitation-header {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: #5a3e36;
    margin: 30px 0 15px 0;
    font-weight: normal;
}

.invitation-text {
    font-family: 'Montserrat', sans-serif;
    color: #5a3e36;
    margin: 10px 0;
    font-size: clamp(0.9rem, 2vw, 1rem);
}

.wedding-details {
    margin: 40px 0;
}

.wedding-date, .wedding-year {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: #5a3e36;
    margin: 5px 0;
    letter-spacing: 1px;
}

.wedding-time {
    font-family: 'Montserrat', sans-serif;
    color: #5a3e36;
    margin: 15px 0 0 0;
    font-size: 1rem;
}

.venue-details {
    margin-top: 40px;
}

.venue-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: #5a3e36;
    margin: 5px 0;
}

.venue-address {
    font-family: 'Montserrat', sans-serif;
    color: #5a3e36;
    margin: 5px 0;
    font-size: 1rem;
}

.invitation-page {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(0);
        transition: transform 0.5s ease, opacity 0.5s ease;
        overflow-y: auto;
    }

.invitation-card {
        max-height: 100vh;
        overflow-y: auto;
        width: 100%;
        max-width: var(--card-max-width);
}

.gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    
    .gallery-thumbnail {
        width: 100%;
        height: 120px;
        object-fit: cover;
    }
    `;
	
	dynamicStyles.textContent += `
    /* Prevent layout shifts during transitions */
    .invitation-page {
        contain: strict; /* Isolates the element's layout */
    }
    
    /* Smooth indicator transitions */
    .page-indicators {
        transition: opacity 0.3s ease, transform 0.1s ease;
    }
`;

dynamicStyles.textContent += `
    body {
        background-color: #fff9f0;
    }
    
    .container {
        background-color: #fff9f0;
    }
    
    .envelope {
        background-color: transparent;
    }
`;

dynamicStyles.textContent += `
    /* Smooth transitions */
    .invitation-page {
        transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
        will-change: transform;
    }
    
    /* Prevent flash of unstyled content */
    .invitation-container {
        backface-visibility: hidden;
        perspective: 1000px;
    }
    
    /* Better touch target for mobile */
    .page-indicators span {
        width: 14px;
        height: 14px;
    }
`;

dynamicStyles.textContent += `
    /* Location Page Specific Fixes */
    .location-page .invitation-border {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .location-page .invitation-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .map-ratio-keeper {
        position: relative;
        padding-bottom: 75%; /* 4:3 aspect ratio */
        height: 0;
    }
    
    .map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    @media (max-width: 480px) {
        .location-page .invitation-content {
            transform: none;
        }
        
        .transportation {
            margin-bottom: 5px;
        }
    }
`;

dynamicStyles.textContent += `
    /* Enhanced gold metallic effect */
    .invitation-border {
        border-image: linear-gradient(135deg, 
            #d4af37 0%, 
            #f9d423 50%, 
            #d4af37 100%);
        border-image-slice: 1;
        position: relative;
    }
    
    /* Letterpress effect for text */
    .couple-names, .page-title, .invitation-header {
        color: #5a3e36;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8),
                     0 -1px 1px rgba(0, 0, 0, 0.1);
    }
    
    /* Enhanced paper texture */
    .invitation-content {
        background-color: #fff9f0;
        background-image: 
            linear-gradient(rgba(255, 255, 255, 0.3) 0.1em, transparent 0.1em),
            linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0.1em, transparent 0.1em);
        background-size: 1em 1em;
    }
    
    /* Raised effect for the card */
    .invitation-card {
        box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 8px 16px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .invitation-card:hover {
        transform: translateY(-5px);
        box-shadow: 
            0 6px 12px rgba(0, 0, 0, 0.15),
            0 12px 24px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.05);
    }
`;

dynamicStyles.textContent += `
    /* Metallic Envelope Accents */
    .envelope-corner {
        stroke: url(#metallicGradient);
        stroke-width: 1.2px;
        stroke-linecap: round;
    }
    
    /* Metallic Gradient Definition */
    svg defs #metallicGradient {
        background: linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%);
    }
    
    /* Envelope Texture */
    .envelope-back {
        background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="%23f5e9dc" fill-opacity="0.05" d="M0,0 L100,0 L100,100 L0,100 Z M10,10 L90,10 L90,90 L10,90 Z" stroke-width="0.5"/></svg>');
    }
    
    /* Smooth Open/Close Transitions */
    .envelope {
        transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .envelope:hover:not(.open) {
        transform: translateY(-5px);
        filter: drop-shadow(0 15px 25px rgba(90, 62, 54, 0.3));
    }
`;

dynamicStyles.textContent += `
    /* Enhanced Location Page Spacing */
    .location-page .invitation-content {
        padding-top: 10px !important;
    }
    
    .location-page .map-ratio-keeper {
        margin-top: 8px;
        margin-bottom: 8px;
    }
    
    .location-page .grid-cell p {
        margin: 4px 0;
        line-height: 1.3;
    }
`;


    document.head.appendChild(dynamicStyles);
});