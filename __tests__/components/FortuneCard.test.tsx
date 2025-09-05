import React from 'react'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { FortuneCard } from '@/components/FortuneCard'
import { mockFortune, createMockFetch } from '../utils/test-utils'

// Mock the share functionality
const mockShare = jest.fn()
Object.defineProperty(navigator, 'share', {
  writable: true,
  value: mockShare,
})

// Mock clipboard API
const mockWriteText = jest.fn()
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: mockWriteText,
  },
})

describe('FortuneCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = createMockFetch({ success: true })
  })

  it('renders fortune message correctly', () => {
    render(<FortuneCard fortune={mockFortune} />)
    
    expect(screen.getByText(mockFortune.message)).toBeInTheDocument()
  })

  it('displays fortune metadata', () => {
    render(<FortuneCard fortune={mockFortune} />)
    
    // Check category badge
    expect(screen.getByText('Inspirational')).toBeInTheDocument() // inspirational category
    
    // Check mood indicator
    expect(screen.getByText('Positive')).toBeInTheDocument() // positive mood
    
    // Check source
    expect(screen.getByText('AI')).toBeInTheDocument() // ai source
  })

  it('shows popularity score when showPopularity is true', () => {
    render(<FortuneCard fortune={mockFortune} showPopularity={true} />)
    
    expect(screen.getByText('10')).toBeInTheDocument() // popularity score
    expect(screen.getByLabelText(/受欢迎程度/)).toBeInTheDocument()
  })

  it('hides popularity score when showPopularity is false', () => {
    render(<FortuneCard fortune={mockFortune} showPopularity={false} />)
    
    expect(screen.queryByLabelText(/受欢迎程度/)).not.toBeInTheDocument()
  })

  it('handles copy to clipboard functionality', async () => {
    render(<FortuneCard fortune={mockFortune} />)
    
    const copyButton = screen.getByLabelText(/复制到剪贴板/)
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(mockFortune.message)
    })
  })

  it('handles share functionality when available', async () => {
    // Mock navigator.share as available
    mockShare.mockResolvedValue(undefined)
    
    render(<FortuneCard fortune={mockFortune} />)
    
    const shareButton = screen.getByLabelText(/分享/)
    fireEvent.click(shareButton)
    
    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: 'Fortune Cookie AI - Fortune Cookie',
        text: mockFortune.message,
        url: expect.any(String),
      })
    })
  })

  it('falls back to copy when share is not available', async () => {
    // Mock navigator.share as not available
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    })
    
    render(<FortuneCard fortune={mockFortune} />)
    
    const shareButton = screen.getByLabelText(/分享/)
    fireEvent.click(shareButton)
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        expect.stringContaining(mockFortune.message)
      )
    })
  })

  it('handles like functionality', async () => {
    render(<FortuneCard fortune={mockFortune} />)
    
    const likeButton = screen.getByLabelText(/点赞/)
    fireEvent.click(likeButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/fortunes'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining(mockFortune.id),
        })
      )
    })
  })

  it('shows loading state during like action', async () => {
    // Mock slow API response
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }), 100))
    )
    
    render(<FortuneCard fortune={mockFortune} />)
    
    const likeButton = screen.getByLabelText(/点赞/)
    fireEvent.click(likeButton)
    
    // Should show loading state
    expect(likeButton).toBeDisabled()
    
    await waitFor(() => {
      expect(likeButton).not.toBeDisabled()
    })
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))
    
    render(<FortuneCard fortune={mockFortune} />)
    
    const likeButton = screen.getByLabelText(/点赞/)
    fireEvent.click(likeButton)
    
    await waitFor(() => {
      // Should not crash and button should be enabled again
      expect(likeButton).not.toBeDisabled()
    })
  })

  it('applies custom className when provided', () => {
    const customClass = 'custom-fortune-card'
    render(<FortuneCard fortune={mockFortune} className={customClass} />)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass(customClass)
  })

  it('renders with compact layout when specified', () => {
    render(<FortuneCard fortune={mockFortune} layout="compact" />)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('compact')
  })

  it('renders with full layout by default', () => {
    render(<FortuneCard fortune={mockFortune} />)
    
    const card = screen.getByRole('article')
    expect(card).not.toHaveClass('compact')
  })

  it('handles keyboard navigation', () => {
    render(<FortuneCard fortune={mockFortune} />)
    
    const card = screen.getByRole('article')
    
    // Should be focusable
    expect(card).toHaveAttribute('tabIndex', '0')
    
    // Test keyboard events
    fireEvent.keyDown(card, { key: 'Enter' })
    fireEvent.keyDown(card, { key: ' ' })
    
    // Should not crash
    expect(card).toBeInTheDocument()
  })

  it('displays tags when available', () => {
    const fortuneWithTags = {
      ...mockFortune,
      tags: ['motivation', 'success', 'positive'],
    }
    
    render(<FortuneCard fortune={fortuneWithTags} showTags={true} />)
    
    expect(screen.getByText('motivation')).toBeInTheDocument()
    expect(screen.getByText('success')).toBeInTheDocument()
    expect(screen.getByText('positive')).toBeInTheDocument()
  })

  it('hides tags when showTags is false', () => {
    const fortuneWithTags = {
      ...mockFortune,
      tags: ['motivation', 'success'],
    }
    
    render(<FortuneCard fortune={fortuneWithTags} showTags={false} />)
    
    expect(screen.queryByText('motivation')).not.toBeInTheDocument()
    expect(screen.queryByText('success')).not.toBeInTheDocument()
  })

  it('handles empty or null fortune gracefully', () => {
    const emptyFortune = {
      ...mockFortune,
      message: '',
    }
    
    render(<FortuneCard fortune={emptyFortune} />)
    
    // Should render without crashing
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('formats creation date correctly', () => {
    render(<FortuneCard fortune={mockFortune} showDate={true} />)
    
    // Should show formatted date
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('calls onLike callback when provided', async () => {
    const mockOnLike = jest.fn()
    render(<FortuneCard fortune={mockFortune} onLike={mockOnLike} />)
    
    const likeButton = screen.getByLabelText(/点赞/)
    fireEvent.click(likeButton)
    
    await waitFor(() => {
      expect(mockOnLike).toHaveBeenCalledWith(mockFortune.id)
    })
  })

  it('calls onShare callback when provided', async () => {
    const mockOnShare = jest.fn()
    render(<FortuneCard fortune={mockFortune} onShare={mockOnShare} />)
    
    const shareButton = screen.getByLabelText(/分享/)
    fireEvent.click(shareButton)
    
    await waitFor(() => {
      expect(mockOnShare).toHaveBeenCalledWith(mockFortune)
    })
  })
})
