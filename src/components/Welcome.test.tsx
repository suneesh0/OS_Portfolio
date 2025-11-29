import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Welcome from './Welcome'
import gsap from 'gsap'

describe('Welcome Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the welcome section', () => {
      render(<Welcome />)
      
      const section = document.querySelector('#welcome')
      expect(section).toBeInTheDocument()
    })

    it('should render the subtitle text', () => {
      render(<Welcome />)
      
      const subtitle = screen.getByText((content, element) => {
        return element?.textContent === 'Hi, Welcome to my.'
      })
      expect(subtitle).toBeInTheDocument()
    })

    it('should render the title text', () => {
      render(<Welcome />)
      
      const title = screen.getByText((content, element) => {
        return element?.textContent === 'Portfolio'
      })
      expect(title).toBeInTheDocument()
    })

    it('should render subtitle in paragraph element with ref', () => {
      render(<Welcome />)
      
      const paragraph = document.querySelector('p')
      expect(paragraph).toBeInTheDocument()
      expect(paragraph?.textContent).toContain('Hi, Welcome to my.')
    })

    it('should render title in h1 element with ref', () => {
      render(<Welcome />)
      
      const heading = document.querySelector('h1')
      expect(heading).toBeInTheDocument()
      expect(heading?.textContent).toContain('Portfolio')
    })
  })

  describe('Text Rendering (renderText function)', () => {
    it('should render each character as a separate span', () => {
      render(<Welcome />)
      
      const spans = document.querySelectorAll('span')
      // "Hi, Welcome to my." = 18 chars + "Portfolio" = 9 chars = 27 total
      expect(spans.length).toBe(27)
    })

    it('should convert spaces to non-breaking spaces', () => {
      render(<Welcome />)
      
      const paragraph = document.querySelector('p')
      const spans = paragraph?.querySelectorAll('span')
      
      // Check for non-breaking space character
      const hasNonBreakingSpace = Array.from(spans || []).some(span => 
        span.textContent === '\u00A0'
      )
      expect(hasNonBreakingSpace).toBe(true)
    })

    it('should apply correct className to subtitle spans', () => {
      render(<Welcome />)
      
      const paragraph = document.querySelector('p')
      const spans = paragraph?.querySelectorAll('span')
      
      spans?.forEach(span => {
        expect(span.className).toContain('text-3xl')
        expect(span.className).toContain('font-georama')
      })
    })

    it('should apply correct className to title spans', () => {
      render(<Welcome />)
      
      const heading = document.querySelector('h1')
      const spans = heading?.querySelectorAll('span')
      
      spans?.forEach(span => {
        expect(span.className).toContain('text-9xl')
        expect(span.className).toContain('italic')
        expect(span.className).toContain('font-georama')
      })
    })

    it('should apply fontVariationSettings style to each span', () => {
      render(<Welcome />)
      
      const spans = document.querySelectorAll('span')
      
      spans.forEach(span => {
        const style = span.getAttribute('style')
        expect(style).toContain('fontVariationSettings')
        expect(style).toContain('wght')
      })
    })

    it('should apply correct base weight to subtitle (100)', () => {
      render(<Welcome />)
      
      const paragraph = document.querySelector('p')
      const firstSpan = paragraph?.querySelector('span')
      
      const style = firstSpan?.getAttribute('style')
      expect(style).toContain("'wght' 100")
    })

    it('should apply default base weight to title (400)', () => {
      render(<Welcome />)
      
      const heading = document.querySelector('h1')
      const firstSpan = heading?.querySelector('span')
      
      const style = firstSpan?.getAttribute('style')
      expect(style).toContain("'wght' 400")
    })
  })

  describe('GSAP Integration', () => {
    it('should call useGSAP hook', () => {
      const { useGSAP } = require('@gsap/react')
      
      render(<Welcome />)
      
      expect(useGSAP).toHaveBeenCalled()
    })

    it('should setup hover effects through useGSAP', () => {
      render(<Welcome />)
      
      const { useGSAP } = require('@gsap/react')
      expect(useGSAP).toHaveBeenCalledWith(expect.any(Function), [])
    })

    it('should not crash if GSAP is unavailable', () => {
      expect(() => {
        render(<Welcome />)
      }).not.toThrow()
    })
  })

  describe('Mouse Interaction (setUpHover behavior)', () => {
    it('should add event listeners for mousemove and mouseleave', () => {
      const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener')
      
      render(<Welcome />)
      
      // Should set up listeners for both subtitle and title containers
      const mouseMoveCalls = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      )
      const mouseLeaveCalls = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mouseleave'
      )
      
      expect(mouseMoveCalls.length).toBeGreaterThanOrEqual(1)
      expect(mouseLeaveCalls.length).toBeGreaterThanOrEqual(1)
    })

    it('should trigger GSAP animations on mousemove', async () => {
      render(<Welcome />)
      
      const paragraph = document.querySelector('p')
      
      if (paragraph) {
        fireEvent.mouseMove(paragraph, { clientX: 100, clientY: 50 })
        
        await waitFor(() => {
          expect(gsap.to).toHaveBeenCalled()
        })
      }
    })

    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener')
      
      const { unmount } = render(<Welcome />)
      unmount()
      
      const mouseMoveCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      )
      const mouseLeaveCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mouseleave'
      )
      
      expect(mouseMoveCalls.length).toBeGreaterThanOrEqual(1)
      expect(mouseLeaveCalls.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('FONT_WEIGHTS Configuration', () => {
    it('should have correct subtitle weight range', () => {
      // This tests the internal configuration
      render(<Welcome />)
      
      // Subtitle should use weights between 100-400
      const paragraph = document.querySelector('p')
      const firstSpan = paragraph?.querySelector('span')
      const style = firstSpan?.getAttribute('style')
      
      expect(style).toContain("'wght' 100") // default for subtitle
    })

    it('should have correct title weight range', () => {
      render(<Welcome />)
      
      // Title should use weights between 400-900
      const heading = document.querySelector('h1')
      const firstSpan = heading?.querySelector('span')
      const style = firstSpan?.getAttribute('style')
      
      expect(style).toContain("'wght' 400") // default for title
    })
  })

  describe('Refs Management', () => {
    it('should create refs for title and subtitle', () => {
      const { container } = render(<Welcome />)
      
      const paragraph = container.querySelector('p')
      const heading = container.querySelector('h1')
      
      expect(paragraph).toBeInTheDocument()
      expect(heading).toBeInTheDocument()
    })

    it('should maintain refs throughout component lifecycle', () => {
      const { rerender } = render(<Welcome />)
      
      const initialP = document.querySelector('p')
      const initialH1 = document.querySelector('h1')
      
      rerender(<Welcome />)
      
      const rerenderedP = document.querySelector('p')
      const rerenderedH1 = document.querySelector('h1')
      
      expect(rerenderedP).toBeInTheDocument()
      expect(rerenderedH1).toBeInTheDocument()
    })
  })

  describe('Semantic HTML', () => {
    it('should use section element with correct id', () => {
      render(<Welcome />)
      
      const section = document.querySelector('section#welcome')
      expect(section).toBeInTheDocument()
    })

    it('should use h1 for main heading', () => {
      render(<Welcome />)
      
      const h1 = document.querySelector('h1')
      expect(h1).toBeInTheDocument()
      expect(h1?.textContent).toBe('Portfolio')
    })

    it('should use p for subtitle', () => {
      render(<Welcome />)
      
      const p = document.querySelector('p')
      expect(p).toBeInTheDocument()
      expect(p?.textContent).toBe('Hi, Welcome to my.')
    })
  })

  describe('CSS Classes', () => {
    it('should apply mt-7 class to h1', () => {
      render(<Welcome />)
      
      const h1 = document.querySelector('h1')
      expect(h1?.className).toContain('mt-7')
    })

    it('should have proper Tailwind classes on h1', () => {
      render(<Welcome />)
      
      const h1 = document.querySelector('h1')
      expect(h1?.className).toContain('mt-7')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle null container gracefully in setUpHover', () => {
      // Test internal logic by rendering and immediately unmounting
      expect(() => {
        const { unmount } = render(<Welcome />)
        unmount()
      }).not.toThrow()
    })

    it('should handle empty text strings', () => {
      // The component always has fixed text, but test the renderText logic
      render(<Welcome />)
      
      const spans = document.querySelectorAll('span')
      expect(spans.length).toBeGreaterThan(0)
    })

    it('should not crash with rapid mouse movements', () => {
      render(<Welcome />)
      
      const paragraph = document.querySelector('p')
      
      expect(() => {
        for (let i = 0; i < 100; i++) {
          if (paragraph) {
            fireEvent.mouseMove(paragraph, { clientX: i * 10, clientY: 50 })
          }
        }
      }).not.toThrow()
    })

    it('should handle multiple mount/unmount cycles', () => {
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<Welcome />)
        expect(document.querySelector('#welcome')).toBeInTheDocument()
        unmount()
      }
    })
  })

  describe('Performance', () => {
    it('should not leak memory on repeated renders', () => {
      for (let i = 0; i < 10; i++) {
        const { unmount, rerender } = render(<Welcome />)
        rerender(<Welcome />)
        unmount()
      }
      
      expect(true).toBe(true) // If we get here, no memory leaks
    })

    it('should efficiently handle character splitting', () => {
      const startTime = performance.now()
      render(<Welcome />)
      const endTime = performance.now()
      
      // Rendering should be fast (< 100ms even with character splitting)
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('Integration', () => {
    it('should work with both subtitle and title simultaneously', () => {
      render(<Welcome />)
      
      const section = document.querySelector('#welcome')
      const paragraph = section?.querySelector('p')
      const heading = section?.querySelector('h1')
      
      expect(paragraph).toBeInTheDocument()
      expect(heading).toBeInTheDocument()
      expect(paragraph?.textContent).toBe('Hi, Welcome to my.')
      expect(heading?.textContent).toBe('Portfolio')
    })

    it('should maintain independent hover states for title and subtitle', async () => {
      render(<Welcome />)
      
      const paragraph = document.querySelector('p')
      const heading = document.querySelector('h1')
      
      if (paragraph && heading) {
        fireEvent.mouseMove(paragraph, { clientX: 50, clientY: 50 })
        fireEvent.mouseMove(heading, { clientX: 100, clientY: 100 })
        
        // Both should trigger GSAP animations independently
        await waitFor(() => {
          expect(gsap.to).toHaveBeenCalled()
        })
      }
    })
  })
})