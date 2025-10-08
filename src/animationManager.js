// Animation Manager - Graceful degradation for animations
// Detects if animations are causing problems and disables them gracefully

class AnimationManager {
  constructor() {
    this.animationsEnabled = true;
    this.performanceThreshold = 16; // 60fps threshold
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.problematicAnimations = new Set();
    
    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.disableAnimations();
      return;
    }

    // Monitor performance
    this.monitorPerformance();
    
    // Add error handling for animation failures
    this.setupErrorHandling();
  }

  monitorPerformance() {
    const checkPerformance = () => {
      const now = performance.now();
      const deltaTime = now - this.lastTime;
      
      // If frame rate is too low, disable animations
      if (deltaTime > this.performanceThreshold) {
        console.warn('Low performance detected, disabling animations');
        this.disableAnimations();
        return;
      }
      
      this.lastTime = now;
      this.frameCount++;
      
      // Check every 60 frames
      if (this.frameCount % 60 === 0) {
        this.checkAnimationHealth();
      }
      
      if (this.animationsEnabled) {
        requestAnimationFrame(checkPerformance);
      }
    };
    
    requestAnimationFrame(checkPerformance);
  }

  checkAnimationHealth() {
    // Check for problematic animations
    const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
    
    animatedElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const animation = computedStyle.animation;
      const transition = computedStyle.transition;
      
      // If animation is stuck or causing issues
      if (animation !== 'none' && this.isAnimationStuck(element)) {
        this.problematicAnimations.add(element);
        this.disableElementAnimations(element);
      }
    });
  }

  isAnimationStuck(element) {
    // Simple check for stuck animations
    const rect = element.getBoundingClientRect();
    return rect.width === 0 && rect.height === 0;
  }

  disableElementAnimations(element) {
    element.style.animation = 'none';
    element.style.transition = 'none';
    element.style.transform = 'none';
  }

  setupErrorHandling() {
    // Catch animation errors
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('animation')) {
        console.warn('Animation error detected, disabling animations');
        this.disableAnimations();
      }
    });

    // Monitor for layout thrashing
    const observer = new ResizeObserver((entries) => {
      let layoutShifts = 0;
      entries.forEach(entry => {
        if (entry.contentRect.width === 0 || entry.contentRect.height === 0) {
          layoutShifts++;
        }
      });
      
      if (layoutShifts > 5) {
        console.warn('Layout thrashing detected, disabling animations');
        this.disableAnimations();
      }
    });

    // Observe body for layout changes
    observer.observe(document.body);
  }

  disableAnimations() {
    if (!this.animationsEnabled) return;
    
    console.log('Disabling animations for better performance');
    this.animationsEnabled = false;
    
    // Add no-animations class to body
    document.body.classList.add('no-animations');
    
    // Disable all CSS animations and transitions
    const style = document.createElement('style');
    style.textContent = `
      .no-animations * {
        transition: none !important;
        animation: none !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  enableAnimations() {
    if (this.animationsEnabled) return;
    
    console.log('Re-enabling animations');
    this.animationsEnabled = true;
    document.body.classList.remove('no-animations');
  }

  // Public API
  toggleAnimations() {
    if (this.animationsEnabled) {
      this.disableAnimations();
    } else {
      this.enableAnimations();
    }
  }

  isAnimationsEnabled() {
    return this.animationsEnabled;
  }
}

// Initialize animation manager
const animationManager = new AnimationManager();

// Export for use in components
export default animationManager;

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.animationManager = animationManager;
}
