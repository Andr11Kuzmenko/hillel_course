import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('перемикає користувача по кліку і робить новий запит', async () => {
    const fetchMock = vi.fn((url) =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: Number(url.split('/').pop()), name: `User from ${url}` }),
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    expect(await screen.findByText('User from https://jsonplaceholder.typicode.com/users/1')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'User #3' }))

    expect(await screen.findByText('User from https://jsonplaceholder.typicode.com/users/3')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    vi.unstubAllGlobals()
  })
})
