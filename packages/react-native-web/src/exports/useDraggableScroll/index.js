import { useEffect } from 'react'
import Platform from '../Platform';
import findNodeHandle from '../findNodeHandle';

export default function useDraggableScroll({
  outerRef = null,
  horizontal = false,
  pagingEnabled = false,
  cursor = 'grab',
}) {

  useEffect(() => {
      if (Platform.OS !== 'web' || !outerRef || !outerRef.current || !horizontal) {
        return;
      }
      const slider = (findNodeHandle(outerRef.current));
      if (!slider) {
        return;
      }
      let isDragging = false;
      let isMouseDown = false;
      let startX = 0;
      let scrollLeft = 0;

      const getPageWidth = () => {
        if (slider.children.length > 0) {
          return slider.children[0].children[0].offsetWidth; // Assume all pages are the same width
        }
        return slider.offsetWidth; // Default to slider's width if no children found
      };

      const mouseDown = (e) => {
        isMouseDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = cursor;
        slider.style.scrollBehavior = 'auto';
      };

      const mouseUp = () => {
        if (isDragging) {
          slider.addEventListener(
            'click',
            (e) => e.stopPropagation(),
            { once: true }
          );
        }
        isMouseDown = false;
        isDragging = false;
        slider.style.cursor = 'default';

        if (pagingEnabled) {
          slider.style.scrollBehavior = 'smooth';
          const currentScroll = slider.scrollLeft;
          const pageWidth = getPageWidth();
          const nearestPage = Math.round(currentScroll / pageWidth);
          slider.scrollLeft = nearestPage * pageWidth;
        }
      };

      const mouseMove = (e) => {
        if (!isMouseDown) return;
        
        const x = e.pageX - slider.offsetLeft;
        // Only activate drag if moved enough pixels
        if (Math.abs(x - startX) < 3) return;
        
        isDragging = true;
        e.preventDefault();
  
        const walk = x - startX;
        slider.scrollLeft = scrollLeft - walk;
      }

      slider.addEventListener('mousedown', mouseDown);
      window.addEventListener('mouseup', mouseUp);
      window.addEventListener('mousemove', mouseMove);

      return () => {
        slider.removeEventListener('mousedown', mouseDown);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mousemove', mouseMove);
      };
    },
    [outerRef, cursor, pagingEnabled]
  );
}
