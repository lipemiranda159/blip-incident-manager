import { useEffect, useRef } from 'react';

export function useBodyScrollLock(isOpen: boolean) {
  const originalValuesRef = useRef<{
    bodyOverflow: string;
    htmlOverflow: string;
    bodyPosition: string;
    bodyTop: string;
    bodyWidth: string;
    scrollY: number;
  } | null>(null);
  
  const preventTouchMoveRef = useRef<((e: TouchEvent) => void) | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Safety check - ensure DOM is available
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    try {
      // Store original values
      originalValuesRef.current = {
        bodyOverflow: document.body.style.overflow || '',
        htmlOverflow: document.documentElement.style.overflow || '',
        bodyPosition: document.body.style.position || '',
        bodyTop: document.body.style.top || '',
        bodyWidth: document.body.style.width || '',
        scrollY: window.scrollY || 0
      };
      
      // Apply CSS classes for additional insurance
      document.body.classList.add('modal-scroll-lock');
      document.documentElement.classList.add('modal-scroll-lock-html');
      
      // Apply inline styles (higher specificity)
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${originalValuesRef.current.scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.left = '0';
      document.body.style.right = '0';
      
      // Additional prevention for touch devices
      preventTouchMoveRef.current = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('touchmove', preventTouchMoveRef.current, { passive: false });
    } catch (error) {
      console.warn('Error applying scroll lock:', error);
    }
      
    // Cleanup function
    return () => {
      try {
        // Safety check - ensure DOM is still available
        if (typeof document === 'undefined' || typeof window === 'undefined') {
          return;
        }

        // Remove CSS classes safely
        if (document.body && document.body.classList) {
          document.body.classList.remove('modal-scroll-lock');
        }
        if (document.documentElement && document.documentElement.classList) {
          document.documentElement.classList.remove('modal-scroll-lock-html');
        }
        
        // Restore original styles if we have them
        if (originalValuesRef.current && document.body && document.documentElement) {
          const original = originalValuesRef.current;
          
          document.body.style.overflow = original.bodyOverflow;
          document.documentElement.style.overflow = original.htmlOverflow;
          document.body.style.position = original.bodyPosition;
          document.body.style.top = original.bodyTop;
          document.body.style.width = original.bodyWidth;
          document.body.style.left = '';
          document.body.style.right = '';
          
          // Restore scroll position
          window.scrollTo(0, original.scrollY);
        }
        
        // Remove touch event listener safely
        if (preventTouchMoveRef.current) {
          document.removeEventListener('touchmove', preventTouchMoveRef.current);
          preventTouchMoveRef.current = null;
        }
        
        // Clear stored values
        originalValuesRef.current = null;
      } catch (error) {
        console.warn('Error cleaning up scroll lock:', error);
      }
    };
  }, [isOpen]);
}
