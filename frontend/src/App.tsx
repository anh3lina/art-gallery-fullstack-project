import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import './App.css'
import { TYPES, type Artwork, type ArtworkType, type FormState } from './types'

const API_URL = `${import.meta.env.VITE_API_URL}/artworks`

const emptyForm: FormState = {
  title: '',
  artist: '',
  type: TYPES[0],
  price: '',
  available: true,
}

const typeLabel = (type: string) => type.replace('_', ' ')

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')
  const [artist, setArtist] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState('')

  const loadArtworks = async () => {
    const params = new URLSearchParams()
    if (artist) params.set('artist', artist)
    if (type) params.set('type', type)
    if (sort) params.set('price', sort)

    try {
      const res = await fetch(`${API_URL}?${params}`)
      if (!res.ok) throw new Error()
      setArtworks(await res.json())
      setLoadError('')
    } catch {
      setLoadError('Could not load artworks. Check that the server is running.')
    }
  }

  useEffect(() => {
    loadArtworks()
  }, [artist, type, sort])

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setFormError('')

    const title = form.title.trim()
    const artistName = form.artist.trim()
    const price = Number(form.price)

    if (!title) return setFormError('Title cannot be empty')
    if (title.length > 99) return setFormError('Title must be at most 99 characters')
    if (!artistName) return setFormError('Artist cannot be empty')
    if (artistName.length > 50) return setFormError('Artist must be at most 50 characters')
    if (!(price > 0)) return setFormError('Price must be a number greater than 0')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          artist: artistName,
          type: form.type,
          price,
          available: form.available,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message
        return setFormError(message || 'Could not add artwork')
      }

      setForm(emptyForm)
      setShowForm(false)
      await loadArtworks()
    } catch {
      setFormError('Could not reach the server')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      await loadArtworks()
    } catch {
      setLoadError('Could not delete artwork')
    }
  }

  return (
    <div className="page">
      <header className="header">
        <span className="logo">ArtGalleryManager</span>
      </header>

      <main className="main">
        <h1>Explore Our Collection</h1>

        <div className="controls">
          <input
            className="search"
            type="text"
            placeholder="Search by artist and press Enter"
            maxLength={50}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setArtist(search.trim())
            }}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {typeLabel(t)}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort by</option>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
          </select>
        </div>

        {loadError && <p className="error">{loadError}</p>}

        <div className="grid">
          {artworks.map((a) => (
            <article key={a._id} className={`card ${a.available ? 'for-sale' : 'exhibition'}`}>
              <div className="card-row">
                <h2>{a.title}</h2>
                <span className="price">${a.price}</span>
              </div>
              <p className="meta">By: {a.artist}</p>
              <p className="meta">
                {typeLabel(a.type)}, {a.available ? 'for sale' : 'exhibition only'}
              </p>
              <button className="btn small" onClick={() => handleDelete(a._id)}>
                Delete
              </button>
            </article>
          ))}
        </div>

        {!loadError && artworks.length === 0 && (
          <p className="empty">No artworks found. Change the filters or add a new one.</p>
        )}

        <div className="actions">
          <button className="btn" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancel' : 'Add New Artwork'}
          </button>
        </div>

        {showForm && (
          <div className="form-wrap">
            <div className="form-box">
              <form className="form" onSubmit={handleSubmit}>
                <label>
                  Title
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </label>
                <label>
                  Artist
                  <input
                    type="text"
                    value={form.artist}
                    onChange={(e) => setForm({ ...form, artist: e.target.value })}
                  />
                </label>
                <label>
                  Type
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as ArtworkType })}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {typeLabel(t)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  />
                  Available for sale (unchecked means exhibition only)
                </label>

                {formError && <p className="error">{formError}</p>}

                <button className="btn" type="submit">
                  Save artwork
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <strong>ArtGalleryManager</strong>
        <span>Your go-to platform for managing and exploring exquisite art pieces.</span>
      </footer>
    </div>
  )
}

export default App