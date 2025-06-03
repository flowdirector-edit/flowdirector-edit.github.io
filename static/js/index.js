window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

    // Video Diff Component Functionality
    initVideoDiff();
    
    // Video Card Click Functionality
    initVideoCards();

});

function initVideoDiff() {
    // Get all video diff wrappers
    const wrappers = document.querySelectorAll('.video-diff-wrapper');
    
    // Global variables for drag state
    let isDragging = false;
    let currentWrapper = null;
    
    wrappers.forEach(function(wrapper) {
        const divider = wrapper.querySelector('.divider');
        const videoLeft = wrapper.querySelector('.video-left');
        const videoRight = wrapper.querySelector('.video-right');
        
        if (!divider || !videoLeft || !videoRight) {
            return; // Skip if elements don't exist
        }
        
        // Mouse down event on divider
        divider.addEventListener('mousedown', function(e) {
            isDragging = true;
            currentWrapper = wrapper;
            divider.classList.add('dragging');
            
            // Prevent text selection during drag
            document.body.style.userSelect = 'none';
            
            e.preventDefault();
        });
        
        // Touch events for mobile
        divider.addEventListener('touchstart', function(e) {
            isDragging = true;
            currentWrapper = wrapper;
            divider.classList.add('dragging');
            
            e.preventDefault();
        });
    });
    
    // Global mouse move event
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !currentWrapper) return;
        
        const divider = currentWrapper.querySelector('.divider');
        const videoLeft = currentWrapper.querySelector('.video-left');
        const wrapperRect = currentWrapper.getBoundingClientRect();
        const wrapperWidth = wrapperRect.width;
        const mouseX = e.clientX - wrapperRect.left;
        
        // Calculate percentage (allow full range 0% to 100%)
        let percentage = (mouseX / wrapperWidth) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Update clip-path for video-left to show only left portion
        const rightClip = 100 - percentage;
        videoLeft.style.clipPath = `inset(0 ${rightClip}% 0 0)`;
        
        // Update divider position
        divider.style.left = percentage + '%';
        
        e.preventDefault();
    });
    
    // Global mouse up event
    document.addEventListener('mouseup', function() {
        if (isDragging && currentWrapper) {
            const divider = currentWrapper.querySelector('.divider');
            isDragging = false;
            currentWrapper = null;
            divider.classList.remove('dragging');
            document.body.style.userSelect = '';
        }
    });
    
    // Global touch move event
    document.addEventListener('touchmove', function(e) {
        if (!isDragging || !currentWrapper) return;
        
        const touch = e.touches[0];
        const divider = currentWrapper.querySelector('.divider');
        const videoLeft = currentWrapper.querySelector('.video-left');
        const wrapperRect = currentWrapper.getBoundingClientRect();
        const wrapperWidth = wrapperRect.width;
        const touchX = touch.clientX - wrapperRect.left;
        
        // Calculate percentage (allow full range 0% to 100%)
        let percentage = (touchX / wrapperWidth) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Update clip-path for video-left to show only left portion
        const rightClip = 100 - percentage;
        videoLeft.style.clipPath = `inset(0 ${rightClip}% 0 0)`;
        
        // Update divider position
        divider.style.left = percentage + '%';
        
        e.preventDefault();
    });
    
    // Global touch end event
    document.addEventListener('touchend', function() {
        if (isDragging && currentWrapper) {
            const divider = currentWrapper.querySelector('.divider');
            isDragging = false;
            currentWrapper = null;
            divider.classList.remove('dragging');
        }
    });
}

function initVideoCards() {
    // Get all video cards
    const videoCards = document.querySelectorAll('.video-card');
    
    // Mapping of edited videos to their target words
    const targetWords = {
        'bear_g_01.mp4': 'large panda',
        'rabbit_01.mp4': 'Crochet rabbit',
        'wolf_01.mp4': 'fox',
        'blackswan_01.mp4': 'pink flamingo',
        'puppy_01.mp4': 'chinchilla',
        'jeep_01.mp4': 'Porsche car',
        'sea_turtle_01.mp4': 'dolphin',
        'woman_02.mp4': 'woman in a black dress and a red baseball cap',
        'cockatiel_01.mp4': 'blue budgie',
        'dog_flower_g_01.mp4': 'golden retriever',
        'cat_box_01.mp4': 'dogs',
        'sea_lion_01.mp4': 'Seahorse',
        'gym_woman_02.mp4': 'Spider-Man',
        'bear_g_03.mp4': 'large dinosaur',
        'rabbit_04.mp4': 'apple',
        'blackswan_02.mp4': 'white duck',
        'wolf_02.mp4': 'husky',
        'puppy_02.mp4': 'cat',
        'gym_woman_01.mp4': 'chimpanzee',
        'cockatiel_02.mp4': 'eagle',
        'jeep_02.mp4': 'Tractor',
        'sea_turtle_02.mp4': 'seal',
        'woman_01.mp4': 'woman in a blue shirt and jeans',
        'dog_flower_g_02.mp4': 'golden retriever with a colorful collar',
        'cat_box_02.mp4': 'kangaroo',
        'sea_lion_02.mp4': 'Clownfish',
        'rabbit_02.mp4': 'Origami rabbit',
        'puppy_03.mp4': 'koala'
    };
    
    videoCards.forEach(function(card) {
        const originalPath = card.getAttribute('data-original');
        const video = card.querySelector('video');
        const source = video.querySelector('source');
        const editedPath = source.getAttribute('src');
        
        // Store the edited path
        card.setAttribute('data-edited', editedPath);
        
        // Get target words for this video
        const filename = editedPath.split('/').pop();
        const targetWord = targetWords[filename] || '';
        
        // Create target word overlay
        const overlay = document.createElement('div');
        overlay.className = 'target-word-overlay';
        overlay.textContent = targetWord;
        overlay.style.display = 'none';
        card.appendChild(overlay);
        
        // Add click event listener
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle between original and edited
            if (card.classList.contains('showing-original')) {
                // Show edited version
                source.setAttribute('src', editedPath);
                card.classList.remove('showing-original');
                overlay.style.display = 'none';
            } else {
                // Show original version
                source.setAttribute('src', originalPath);
                card.classList.add('showing-original');
                overlay.style.display = 'flex';
            }
            
            // Reload the video
            video.load();
            video.play();
        });
    });
}
