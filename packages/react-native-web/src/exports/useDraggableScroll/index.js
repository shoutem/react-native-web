import { useEffect } from 'react'
import Platform from '../Platform';
import findNodeHandle from '../findNodeHandle';

export default function useDraggableScroll({
  outerRef = null,
  cursor = 'grab',
}) {

  useEffect(() => {
      if (Platform.OS !== 'web' || !outerRef) {
        return
      }
      const slider = (findNodeHandle(outerRef.current));
      if (!slider) {
        return
      }
      let isDragging = false
      let isMouseDown = false
      let startX = 0
      let scrollLeft = 0

      const mouseDown = (e) => {
        isMouseDown = true
        startX = e.pageX - slider.offsetLeft
        scrollLeft = slider.scrollLeft

        slider.style.cursor = cursor
      }

      const mouseUp = () => {
        if (isDragging) slider.addEventListener("click", (e) => e.stopPropagation(), { once: true })
 
        isMouseDown = false
        isDragging = false
        slider.style.cursor = 'default'
      }

      const mouseMove = (e) => {
        if (!isMouseDown) return
        
        // Require n pixels momement before start of drag (3 in this case )
        const x = e.pageX - slider.offsetLeft
        if (Math.abs(x - startX) < 3) return
        
        isDragging = true
        e.preventDefault()
        const walk = x - startX
        slider.scrollLeft = scrollLeft - walk
      }

      slider.addEventListener('mousedown', mouseDown)
      window.addEventListener('mouseup', mouseUp)
      window.addEventListener('mousemove', mouseMove)

      return () => {
        slider.removeEventListener('mousedown', mouseDown)
        window.removeEventListener('mouseup', mouseUp)
        window.removeEventListener('mousemove', mouseMove)
      }
    },
    [cursor]
  );
}
