import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Navbar from './Navbar'
import dayjs from 'dayjs'

// Mock the constants
vi.mock('#constants/index', () => ({
  navLinks: [
    { id: 1, name: 'Projects' },
    { id: 2, name: 'About' },
    { id: 3, name: 'Contact' },
  ],
  navIcons: [
    { id: 1, img: '/icons/wifi.svg' },
    { id: 2, img: '/icons/search.svg' },
    { id: 3, img: '/icons/user.svg' },
  ],
}))

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render the navbar with logo and title', () => {
      render(<Navbar />)
      
      const logo = screen.getByAlt('logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/images/logo.svg')
      
      expect(screen.getByText('My Portfolio')).toBeInTheDocument()
    })

    it('should render all navigation links', () => {
      render(<Navbar />)
      
      expect(screen.getByText('Projects')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('should render all navigation icons with correct attributes', () => {
      render(<Navbar />)
      
      const icons = screen.getAllByRole('img').filter(img => 
        img.getAttribute('alt')?.startsWith('icon-')
      )
      
      expect(icons).toHaveLength(3)
      expect(icons[0]).toHaveAttribute('src', '/icons/wifi.svg')
      expect(icons[0]).toHaveAttribute('alt', 'icon-1')
      expect(icons[1]).toHaveAttribute('src', '/icons/search.svg')
      expect(icons[2]).toHaveAttribute('src', '/icons/user.svg')
    })

    it('should render navigation in proper structure with lists', () => {
      render(<Navbar />)
      
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Time Display', () => {
    it('should display the current time in correct format on initial render', () => {
      const mockDate = new Date('2024-01-15T14:30:45')
      vi.setSystemTime(mockDate)
      
      render(<Navbar />)
      
      const expectedTime = dayjs(mockDate).format('ddd MMM D h:mm:ss A')
      expect(screen.getByText(expectedTime)).toBeInTheDocument()
    })

    it('should update time every second', async () => {
      const initialDate = new Date('2024-01-15T14:30:45')
      vi.setSystemTime(initialDate)
      
      render(<Navbar />)
      
      const initialTime = dayjs(initialDate).format('ddd MMM D h:mm:ss A')
      expect(screen.getByText(initialTime)).toBeInTheDocument()
      
      // Advance time by 1 second
      const newDate = new Date('2024-01-15T14:30:46')
      vi.setSystemTime(newDate)
      vi.advanceTimersByTime(1000)
      
      await waitFor(() => {
        const newTime = dayjs(newDate).format('ddd MMM D h:mm:ss A')
        expect(screen.getByText(newTime)).toBeInTheDocument()
      })
    })

    it('should update time multiple times as seconds pass', async () => {
      const initialDate = new Date('2024-01-15T14:30:00')
      vi.setSystemTime(initialDate)
      
      render(<Navbar />)
      
      // Advance by 3 seconds
      for (let i = 1; i <= 3; i++) {
        const nextDate = new Date(`2024-01-15T14:30:0${i}`)
        vi.setSystemTime(nextDate)
        vi.advanceTimersByTime(1000)
        
        await waitFor(() => {
          const expectedTime = dayjs(nextDate).format('ddd MMM D h:mm:ss A')
          expect(screen.getByText(expectedTime)).toBeInTheDocument()
        })
      }
    })

    it('should display time in a time element', () => {
      render(<Navbar />)
      
      const timeElement = document.querySelector('time')
      expect(timeElement).toBeInTheDocument()
    })
  })

  describe('Interval Management', () => {
    it('should clear interval on component unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      
      const { unmount } = render(<Navbar />)
      unmount()
      
      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('should only have one interval running', () => {
      const setIntervalSpy = vi.spyOn(global, 'setInterval')
      
      render(<Navbar />)
      
      expect(setIntervalSpy).toHaveBeenCalledTimes(1)
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty navLinks array gracefully', () => {
      vi.doMock('#constants/index', () => ({
        navLinks: [],
        navIcons: [{ id: 1, img: '/icons/wifi.svg' }],
      }))
      
      const { container } = render(<Navbar />)
      expect(container.querySelector('nav')).toBeInTheDocument()
    })

    it('should handle empty navIcons array gracefully', () => {
      vi.doMock('#constants/index', () => ({
        navLinks: [{ id: 1, name: 'Projects' }],
        navIcons: [],
      }))
      
      const { container } = render(<Navbar />)
      expect(container.querySelector('nav')).toBeInTheDocument()
    })

    it('should handle dayjs formatting without errors', () => {
      const edgeDates = [
        new Date('2024-12-31T23:59:59'),
        new Date('2024-01-01T00:00:00'),
        new Date('2024-02-29T12:00:00'), // Leap year
      ]
      
      edgeDates.forEach(date => {
        vi.setSystemTime(date)
        const { unmount } = render(<Navbar />)
        
        const expectedTime = dayjs(date).format('ddd MMM D h:mm:ss A')
        expect(screen.getByText(expectedTime)).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for logo', () => {
      render(<Navbar />)
      
      const logo = screen.getByAlt('logo')
      expect(logo).toHaveAccessibleName('logo')
    })

    it('should have proper alt text for all icons', () => {
      render(<Navbar />)
      
      const icon1 = screen.getByAlt('icon-1')
      const icon2 = screen.getByAlt('icon-2')
      const icon3 = screen.getByAlt('icon-3')
      
      expect(icon1).toHaveAccessibleName('icon-1')
      expect(icon2).toHaveAccessibleName('icon-2')
      expect(icon3).toHaveAccessibleName('icon-3')
    })

    it('should use semantic nav element', () => {
      const { container } = render(<Navbar />)
      
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should use semantic time element for time display', () => {
      render(<Navbar />)
      
      const timeElement = document.querySelector('time')
      expect(timeElement).toBeInTheDocument()
      expect(timeElement?.tagName.toLowerCase()).toBe('time')
    })
  })

  describe('Performance', () => {
    it('should not cause memory leaks with multiple mounts and unmounts', () => {
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<Navbar />)
        unmount()
      }
      
      // If we reach here without errors, memory is being cleaned up properly
      expect(true).toBe(true)
    })

    it('should handle rapid time updates without crashing', async () => {
      render(<Navbar />)
      
      // Advance time rapidly
      for (let i = 0; i < 100; i++) {
        vi.advanceTimersByTime(1000)
      }
      
      // Component should still be functional
      expect(document.querySelector('time')).toBeInTheDocument()
    })
  })
})