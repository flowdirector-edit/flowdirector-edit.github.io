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
