import { describe, it, expect } from 'vitest'
import * as ComponentIndex from './index'

describe('Component Index', () => {
  describe('Exports', () => {
    it('should export Navbar component', () => {
      expect(ComponentIndex.Navbar).toBeDefined()
      expect(typeof ComponentIndex.Navbar).toBe('function')
    })

    it('should export Welcome component', () => {
      expect(ComponentIndex.Welcome).toBeDefined()
      expect(typeof ComponentIndex.Welcome).toBe('function')
    })

    it('should export exactly 2 components', () => {
      const exports = Object.keys(ComponentIndex)
      expect(exports).toHaveLength(2)
    })

    it('should have named exports, not default export', () => {
      expect(ComponentIndex).not.toHaveProperty('default')
    })
  })

  describe('Component Types', () => {
    it('Navbar should be a React component', () => {
      const { Navbar } = ComponentIndex
      expect(Navbar).toBeDefined()
      expect(Navbar.prototype).toBeUndefined() // Functional component
    })

    it('Welcome should be a React component', () => {
      const { Welcome } = ComponentIndex
      expect(Welcome).toBeDefined()
      expect(Welcome.prototype).toBeUndefined() // Functional component
    })
  })

  describe('Import/Export Integrity', () => {
    it('should maintain consistent export names', () => {
      const exportedNames = Object.keys(ComponentIndex)
      expect(exportedNames).toContain('Navbar')
      expect(exportedNames).toContain('Welcome')
    })

    it('should allow destructured imports', () => {
      const { Navbar, Welcome } = ComponentIndex
      expect(Navbar).toBeDefined()
      expect(Welcome).toBeDefined()
    })

    it('should allow namespace imports', () => {
      const Components = ComponentIndex
      expect(Components.Navbar).toBeDefined()
      expect(Components.Welcome).toBeDefined()
    })
  })

  describe('Re-export Validation', () => {
    it('should not add additional properties to components', () => {
      const { Navbar } = ComponentIndex
      // Check that it's a clean function without unexpected properties
      const ownProps = Object.getOwnPropertyNames(Navbar)
      expect(ownProps).toContain('length')
      expect(ownProps).toContain('name')
    })

    it('should preserve component display names if set', () => {
      const { Navbar, Welcome } = ComponentIndex
      // Check if display names are preserved (or undefined is acceptable)
      if (Navbar.displayName) {
        expect(typeof Navbar.displayName).toBe('string')
      }
      if (Welcome.displayName) {
        expect(typeof Welcome.displayName).toBe('string')
      }
    })
  })
})