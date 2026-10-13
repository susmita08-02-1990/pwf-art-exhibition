'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Artwork = {
  id: number
  title: string
  status: 'available' | 'sold' | 'not_for_sale'
  accepts_custom_order: boolean
}

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function checkLogin() {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        setLoggedIn(true)
        loadArtworks()
      }
    }

    checkLogin()
  }, [])

  async function loadArtworks() {
    const { data, error } = await supabase
      .from('artworks')
      .select('id, title, status, accepts_custom_order')
      .order('display_order', { ascending: true })

    if (error) {
      setMessage(error.message)
      return
    }

    setArtworks((data ?? []) as Artwork[])
  }

  async function login() {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setLoggedIn(true)
      await loadArtworks()
    }

    setLoading(false)
  }

  async function saveArtwork(artwork: Artwork) {
    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('artworks')
      .update({
        status: artwork.status,
        accepts_custom_order: artwork.accepts_custom_order,
      })
      .eq('id', artwork.id)

    setMessage(
      error
        ? `Error: ${error.message}`
        : `Saved: ${artwork.title}`
    )

    setLoading(false)
  }

  function updateLocal(
    id: number,
    changes: Partial<Artwork>
  ) {
    setArtworks((current) =>
      current.map((artwork) =>
        artwork.id === id
          ? { ...artwork, ...changes }
          : artwork
      )
    )
  }

  async function logout() {
    await supabase.auth.signOut()
    setLoggedIn(false)
    setArtworks([])
  }

  return (
    <main className="min-h-screen bg-[#f5f0e8] p-4 text-[#29231f]">
      <div className="mx-auto max-w-2xl">

        <h1 className="mb-6 font-serif text-3xl">
          PWF Art Exhibition — Admin
        </h1>

        {!loggedIn ? (
          <div className="rounded-xl bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
              Admin Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 w-full rounded-lg border p-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded-lg border p-3"
            />

            <button
              onClick={login}
              disabled={loading}
              className="w-full rounded-lg bg-[#743d2c] p-3 text-white"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

          </div>
        ) : (
          <>
            <button
              onClick={logout}
              className="mb-5 text-sm underline"
            >
              Logout
            </button>

            <div className="space-y-4">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="rounded-xl border bg-white p-5"
                >
                  <h2 className="mb-4 font-serif text-xl">
                    {artwork.title}
                  </h2>

                  <label className="mb-2 block text-sm font-medium">
                    Painting Status
                  </label>

                  <select
                    value={artwork.status}
                    onChange={(e) =>
                      updateLocal(artwork.id, {
                        status: e.target.value as Artwork['status'],
                      })
                    }
                    className="mb-4 w-full rounded-lg border p-3"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="not_for_sale">
                      Not for Sale
                    </option>
                  </select>

                  <label className="mb-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={artwork.accepts_custom_order}
                      onChange={(e) =>
                        updateLocal(artwork.id, {
                          accepts_custom_order: e.target.checked,
                        })
                      }
                    />
                    Accept Custom Orders
                  </label>

                  <button
                    onClick={() => saveArtwork(artwork)}
                    disabled={loading}
                    className="w-full rounded-lg bg-[#743d2c] p-3 text-white disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {message && (
          <p className="mt-5 rounded-lg bg-white p-3 text-sm">
            {message}
          </p>
        )}

      </div>
    </main>
  )
}