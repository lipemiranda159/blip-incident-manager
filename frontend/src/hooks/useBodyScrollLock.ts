import { useEffect } from 'react';

export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      // Store original values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyPosition = document.body.style.position;
      const originalBodyTop = document.body.style.top;
      const originalBodyWidth = document.body.style.width;
      
      // Get current scroll position
      const scrollY = window.scrollY;
      
      // Apply CSS classes for additional insurance
      document.body.classList.add('modal-scroll-lock');
      document.documentElement.classList.add('modal-scroll-lock-html');
      
      // Apply inline styles (higher specificity)
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.left = '0';
      document.body.style.right = '0';
      
      // Additional prevention for touch devices
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      
      // Cleanup function
      return () => {
        // Remove CSS classes
        document.body.classList.remove('modal-scroll-lock');
        document.documentElement.classList.remove('modal-scroll-lock-html');
        
        // Restore original styles
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.width = originalBodyWidth;
        document.body.style.left = '';
        document.body.style.right = '';
        
        // Remove touch event listener
        document.removeEventListener('touchmove', preventTouchMove);
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
}
