
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import LikeButton from '@/components/LikeButton'
import CommentBox from '@/components/CommentBox'
import ViewTracker from '@/components/ViewTracker'
import BuyerActions from '@/components/BuyerActions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Get artwork and its artist
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select(`
      *,
      artists (
        name,
        phone,
        tower,
        apartment,
        bio,
        instagram_url,
        photo_url
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Artwork Supabase error:', error.message)
  }

  if (error || !artwork) {
    return (
      <main className="min-h-screen bg-[#f5f0e8] p-8">
        <h1 className="text-2xl font-semibold">
          Artwork not found
        </h1>

        {error && (
          <p className="mt-4 text-red-600">
            {error.message}
          </p>
        )}

        <Link
          href="/gallery"
          className="mt-6 inline-block text-[#743d2c] underline"
        >
          ← Back to Gallery
        </Link>
      </main>
    )
  }

  // Get like count
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('artwork_id', artwork.id)

  // Get all artworks for navigation
  const { data: allArtworks } = await supabase
    .from('artworks')
    .select('id, slug, title, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })

  const artworks = allArtworks ?? []

  const currentIndex = artworks.findIndex(
    (item) => item.id === artwork.id
  )

  const previousArtwork =
    currentIndex > 0
      ? artworks[currentIndex - 1]
      : null

  const nextArtwork =
    currentIndex >= 0 &&
    currentIndex < artworks.length - 1
      ? artworks[currentIndex + 1]
      : null

  const artworkNumber =
    currentIndex >= 0 ? currentIndex + 1 : 1

  const totalArtworks = artworks.length

  // Artwork availability
  const isAvailable = artwork.status === 'available'
  const isSold = artwork.status === 'sold'
  const isNotForSale = artwork.status === 'not_for_sale'

  const artist = Array.isArray(artwork.artists)
    ? artwork.artists[0]
    : artwork.artists

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#29231f]">

      {/* Track artwork views */}
      <ViewTracker artworkId={artwork.id} />

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">

        {/* EXHIBITION HEADER */}
        <header className="mb-8 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#653426] sm:text-base">
            Pashmina Waterfront
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-wide sm:text-4xl">
            Art Exhibition
          </h2>

          <div className="mx-auto mt-4 flex max-w-[260px] items-center gap-3">
            <span className="h-px flex-1 bg-[#b98570]" />
            <span className="h-2 w-2 rotate-45 border border-[#9a5944]" />
            <span className="h-px flex-1 bg-[#b98570]" />
          </div>

          <p className="mt-4 font-serif text-xl font-medium tracking-[0.08em] text-[#8d4a36] sm:text-2xl">
            শিল্প • সৃষ্টি • উৎসব
          </p>

        </header>

        {/* ARTWORK CARD */}
        <article className="overflow-hidden rounded-2xl border border-[#d8c9b9] bg-[#fffdf9] shadow-sm">

          {/* TOP NAVIGATION */}
          <div className="flex items-center justify-between border-b border-[#e7ddd2] px-4 py-3">

            <Link
              href="/gallery"
              className="text-sm font-medium text-[#7d3f2d]"
            >
              ← Gallery
            </Link>

            <span className="text-xs tracking-wide text-[#81766c]">
              Artwork {artworkNumber} of {totalArtworks}
            </span>

          </div>

          {/* PAINTING */}
          {artwork.image_url && (
            <div className="bg-[#eee7dd] p-3 sm:p-5">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="mx-auto max-h-[75vh] w-full object-contain"
              />
            </div>
          )}

          <div className="px-5 py-6 sm:px-8 sm:py-8">

            {/* ARTWORK INFORMATION */}
            <div className="text-center">

              <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
                {artwork.title}
              </h1>

              <p className="mt-2 text-base text-[#766b62]">
                by{' '}
                <span className="font-medium text-[#453b34]">
                  {artist?.name ?? 'Artist'}
                </span>
              </p>

              <p className="mt-3 text-sm tracking-wide text-[#81766c]">
                {artwork.medium}

                {artwork.size &&
                  ` • ${artwork.size}`}

                {artwork.year &&
                  ` • ${artwork.year}`}
              </p>

            </div>

            {/* LIKE BUTTON */}
            <div className="mt-5 flex justify-center">
              <LikeButton
                artworkId={artwork.id}
                initialLikes={likeCount ?? 0}
              />
            </div>

            {/* STORY */}
            {artwork.story && (
              <section className="mt-9 border-t border-[#e7ddd2] pt-7">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a5944]">
                  Story Behind the Painting
                </p>

                <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-[#514840]">
                  {artwork.story}
                </p>

              </section>
            )}

            {/* BUYER EXPERIENCE */}
            <section className="mt-9 rounded-xl border border-[#dfd0c1] bg-[#faf6f0] p-5">

              <div className="flex items-start justify-between gap-4">

                {/* AVAILABILITY */}
                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8d4a36]">
                    Availability
                  </p>

                  <div className="mt-3">

                    {isAvailable && (
                      <span className="inline-block rounded-full bg-[#e4eee2] px-3 py-1 text-sm font-semibold text-[#3f6741]">
                        ● Available
                      </span>
                    )}

                    {isSold && (
                      <span className="inline-block rounded-full bg-[#efe1dd] px-3 py-1 text-sm font-semibold text-[#8a3f32]">
                        Sold
                      </span>
                    )}

                    {isNotForSale && (
                      <span className="inline-block rounded-full bg-[#ebe7e2] px-3 py-1 text-sm font-semibold text-[#665f58]">
                        Not for Sale
                      </span>
                    )}

                  </div>
                </div>

                {/* PRICE */}
                {artwork.for_sale &&
                  artwork.price != null && (
                    <div className="text-right">

                      <p className="text-xs text-[#81766c]">
                        Price
                      </p>

                      <p className="mt-1 font-serif text-2xl font-semibold text-[#653426]">
                        ₹{Number(artwork.price).toLocaleString('en-IN')}
                      </p>

                    </div>
                  )}

              </div>

              {/* BUY / CUSTOM ORDER BUTTONS */}
              <BuyerActions
                artworkId={artwork.id}
                artworkTitle={artwork.title}
                phone={artist?.phone || ''}
                forSale={artwork.for_sale}
                isAvailable={isAvailable}
                acceptsCustomOrder={artwork.accepts_custom_order}
              />

              {/* COMMISSION NOTE */}
              {artwork.commission_note && (
                <p className="mt-3 text-center text-sm text-[#766b62]">
                  {artwork.commission_note}
                </p>
              )}

              {/* CALL ARTIST */}
              {artist?.phone && (
                <a
                  href={`tel:${artist.phone}`}
                  className="mt-4 block text-center text-sm font-medium text-[#743d2c] underline"
                >
                  Call Artist
                </a>
              )}

            </section>

            {/* ARTIST PROFILE */}
            <section className="mt-9 border-t border-[#e7ddd2] pt-7">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a5944]">
                The Artist
              </p>

              <div className="mt-4 flex items-start gap-4">

                {/* ARTIST PHOTO */}
                {artist?.photo_url && (
                  <img
                    src={artist.photo_url}
                    alt={artist.name}
                    className="h-20 w-20 shrink-0 rounded-full object-cover"
                  />
                )}

                <div>

                  <p className="font-serif text-xl font-semibold">
                    {artist?.name}
                  </p>

                  {(artist?.tower || artist?.apartment) && (
                    <p className="mt-1 text-sm text-[#766b62]">

                      {artist?.tower}

                      {artist?.tower &&
                        artist?.apartment &&
                        ' • '}

                      {artist?.apartment &&
                        `Apartment ${artist.apartment}`}

                    </p>
                  )}

                </div>
              </div>

              {/* BIOGRAPHY */}
              {artist?.bio && (
                <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-[#514840]">
                  {artist.bio}
                </p>
              )}

              {/* ARTIST CONTACT */}
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium text-[#743d2c]">

                {artist?.phone && (
                  <a href={`tel:${artist.phone}`}>
                    ☎ Call
                  </a>
                )}

                {artist?.instagram_url && (
                  <a
                    href={artist.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                )}

              </div>

            </section>

            {/* COMMENTS */}
            <CommentBox artworkId={artwork.id} />

          </div>
        </article>

        {/* PREVIOUS / NEXT NAVIGATION */}
        <nav className="mt-6">

          <div className="grid grid-cols-3 items-center gap-2">

            <div className="text-left">
              {previousArtwork && (
                <Link
                  href={`/art/${previousArtwork.slug}`}
                  className="text-sm font-semibold text-[#743d2c]"
                >
                  ← Previous
                </Link>
              )}
            </div>

            <Link
              href="/gallery"
              className="text-center text-sm font-medium text-[#743d2c] underline"
            >
              View Gallery
            </Link>

            <div className="text-right">
              {nextArtwork && (
                <Link
                  href={`/art/${nextArtwork.slug}`}
                  className="text-sm font-semibold text-[#743d2c]"
                >
                  Next →
                </Link>
              )}
            </div>

          </div>

        </nav>

        {/* FOOTER */}
        <p className="mt-8 text-center text-xs tracking-[0.15em] text-[#9a8d82]">
          PWF DURGA PUJA • ART EXHIBITION
        </p>

      </div>
    </main>
  )
}
