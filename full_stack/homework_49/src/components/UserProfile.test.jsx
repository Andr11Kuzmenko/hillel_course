import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UserProfile from './UserProfile.jsx'

const mockUser = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  address: { city: 'Gwenborough' },
  company: { name: 'Romaguera-Crona' },
}

// Допоміжна функція: створює об'єкт, схожий на Response
function mockResponse(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  }
}

describe('UserProfile', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch')
  })

  it('показує стан завантаження під час запиту', async () => {
    fetch.mockResolvedValueOnce(mockResponse(mockUser))

    render(<UserProfile />)

    expect(screen.getByRole('status')).toHaveTextContent('Завантаження...')
    // дочікуємось завершення, щоб уникнути попереджень act()
    await waitForElementToBeRemoved(() => screen.queryByRole('status'))
  })

  it('викликає fetch з правильним URL', async () => {
    fetch.mockResolvedValueOnce(mockResponse(mockUser))

    render(<UserProfile />)

    await screen.findByText(mockUser.name)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1')
  })

  it('використовує userId з props у URL', async () => {
    fetch.mockResolvedValueOnce(mockResponse({ ...mockUser, id: 5, name: 'Chelsey Dietrich' }))

    render(<UserProfile userId={5} />)

    expect(await screen.findByText('Chelsey Dietrich')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/5')
  })

  it('відображає дані користувача після успішного запиту', async () => {
    fetch.mockResolvedValueOnce(mockResponse(mockUser))

    render(<UserProfile />)

    expect(await screen.findByRole('heading', { name: mockUser.name })).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(mockUser.username)).toBeInTheDocument()
    expect(screen.getByText(mockUser.phone)).toBeInTheDocument()
    expect(screen.getByText(mockUser.address.city)).toBeInTheDocument()
    expect(screen.getByText(mockUser.company.name)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('показує помилку, якщо сервер повернув неуспішний статус', async () => {
    fetch.mockResolvedValueOnce(mockResponse({}, { ok: false, status: 404 }))

    render(<UserProfile userId={999} />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('HTTP error: 404')
    expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument()
  })

  it('показує помилку при збої мережі (reject)', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<UserProfile />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Помилка: Network error')
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('повторно завантажує дані при зміні userId', async () => {
    fetch
      .mockResolvedValueOnce(mockResponse(mockUser))
      .mockResolvedValueOnce(mockResponse({ ...mockUser, id: 2, name: 'Ervin Howell' }))

    const { rerender } = render(<UserProfile userId={1} />)
    await screen.findByText(mockUser.name)

    rerender(<UserProfile userId={2} />)

    expect(await screen.findByText('Ervin Howell')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenLastCalledWith('https://jsonplaceholder.typicode.com/users/2')
  })
})
