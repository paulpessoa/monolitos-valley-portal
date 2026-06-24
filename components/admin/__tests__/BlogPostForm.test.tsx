import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BlogPostForm } from '../BlogPostForm'
import '@testing-library/jest-dom'
import { createClient } from '@/lib/supabase/client'

// Mock useForm since it's a client component using hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('BlogPostForm', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ error: null }),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
    
    // Mock global fetch for API calls
    global.fetch = jest.fn() as jest.Mock
  })

  it('renders Add Post form correctly', () => {
    render(<BlogPostForm onSuccess={jest.fn()} />)
    expect(screen.getByText('Adicionar Post')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Título do post')).toBeInTheDocument()
    expect(screen.getByText('Criar Post')).toBeInTheDocument()
    expect(screen.queryByText('Excluir Post')).not.toBeInTheDocument()
  })

  it('renders Edit Post form correctly with initial data', () => {
    const initialData = {
      id: '123',
      title: 'Post Teste',
      slug: 'post-teste',
      content: 'Conteúdo teste',
      excerpt: 'Resumo teste',
      image_url: 'http://example.com/img.jpg',
    }

    render(<BlogPostForm onSuccess={jest.fn()} initialData={initialData} />)
    
    expect(screen.getByText('Editar Post')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Post Teste')).toBeInTheDocument()
    expect(screen.getByDisplayValue('post-teste')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Resumo teste')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Conteúdo teste')).toBeInTheDocument()
    expect(screen.getByText('Salvar Alterações')).toBeInTheDocument()
    expect(screen.getByText('Excluir Post')).toBeInTheDocument()
  })

  it('calls fetch PUT when saving an existing post', async () => {
    const initialData = {
      id: '123',
      title: 'Post Teste',
      slug: 'post-teste',
      content: 'Conteúdo teste',
      excerpt: 'Resumo teste',
      image_url: '',
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

    render(<BlogPostForm onSuccess={jest.fn()} initialData={initialData} />)

    const titleInput = screen.getByDisplayValue('Post Teste')
    fireEvent.change(titleInput, { target: { value: 'Post Atualizado' } })
    
    const submitBtn = screen.getByText('Salvar Alterações')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/blog-posts/123', expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Post Atualizado')
      }))
    })
  })
})
