
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import LikeButton from '@/components/LikeButton'
import GalleryCommentButton from '@/components/GalleryCommentButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GalleryPage() {
  const { data: artworks, error } = await supabase
    .from('artworks')
    .select(`
      id,
      slug,
      title,
      image_url,
      medium,
      size,
      status,
      for_sale,
      price,
      display_order,
      artists (
        name,
        photo_url
      )
    `)
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) {
    console.error('Gallery Supabase error:', error.message)
  }

  // Fetch like counts
  const artworkIds = (artworks ?? []).map(
    (artwork) => artwork.id
  )

  const { data: likes, error: likesError } = artworkIds.length
    ? await supabase
        .from('likes')
        .select('artwork_id')
        .in('artwork_id', artworkIds)
    : { data: [], error: null }

  if (likesError) {
    console.error('Gallery likes error:', likesError.message)
  }

  const likeCounts = new Map<number, number>()

  for (const like of likes ?? []) {
    likeCounts.set(
      like.artwork_id,
      (likeCounts.get(like.artwork_id) ?? 0) + 1
    )
  }

  const totalArtworks = artworks?.length ?? 0

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#29231f]">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-12">

        {/* EXHIBITION HEADER */}
        <header className="mb-9 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#653426] sm:text-base">
            Pashmina Waterfront
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-wide text-[#29231f] sm:text-4xl">
            Art Exhibition
          </h1>

          <div className="mx-auto mt-4 flex max-w-[260px] items-center gap-3">
            <span className="h-px flex-1 bg-[#b98570]" />
            <span className="h-2 w-2 rotate-45 border border-[#9a5944]" />
            <span className="h-px flex-1 bg-[#b98570]" />
          </div>

          <p className="mt-4 font-serif text-xl font-medium tracking-[0.08em] text-[#8d4a36] sm:text-2xl">
            শিল্প • সৃষ্টি • উৎসব
          </p>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#766b62] sm:text-base">
            Discover the creativity of artists from our community.
            Like your favourites, share your appreciation, or tap a
            painting to explore its story.
          </p>
        </header>

        {/* COLLECTION HEADING */}
        <div className="mb-5 flex items-end justify-between border-b border-[#d8c9b9] pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a5944]">
              The Collection
            </p>

            <h2 className="mt-1 font-serif text-2xl">
              Explore the Artworks
            </h2>
          </div>

          <p className="text-sm text-[#81766c]">
            {totalArtworks}{' '}
            {totalArtworks === 1 ? 'Artwork' : 'Artworks'}
          </p>
        </div>

        {/* DATABASE ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Unable to load artworks. Please try again later.
          </div>
        )}

        {/* ARTWORK GRID */}
        {totalArtworks > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {artworks?.map((artwork, index) => {
              const status = artwork.status?.toLowerCase()

              const isAvailable = status === 'available'
              const isSold = status === 'sold'
              const isNotForSale = status === 'not_for_sale'

              const artist = Array.isArray(artwork.artists)
                ? artwork.artists[0]
                : artwork.artists

              // Adjust Soumita's profile photo crop
              const artistPhotoPosition =
                artist?.name?.trim().toLowerCase() ===
                'soumita paul'
                  ? 'center 15%'
                  : 'center'

              return (
                <div
                  key={artwork.id}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#d8c9b9] bg-[#fffdf9] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >

                  {/* CLICKABLE ARTWORK IMAGE */}
                  <Link href={`/art/${artwork.slug}`}>
                    <div className="relative overflow-hidden bg-[#eee7dd] p-2">
                      {artwork.image_url ? (
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="aspect-[4/5] w-full object-contain transition duration-300 group-hover:scale-[1.015]"
                          loading={index < 3 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <div className="flex aspect-[4/5] items-center justify-center text-sm text-[#81766c]">
                          Artwork image
                        </div>
                      )}

                      {/* ARTWORK NUMBER */}
                      <span className="absolute left-4 top-4 rounded-full bg-[#fffdf9]/95 px-3 py-1 text-xs font-semibold text-[#653426] shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </Link>

                  {/* CARD CONTENT */}
                  <div className="flex flex-1 flex-col p-5">

                    {/* TITLE AND STATUS */}
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/art/${artwork.slug}`}
                        className="min-w-0 hover:text-[#8d4a36]"
                      >
                        <h3 className="font-serif text-xl leading-tight">
                          {artwork.title}
                        </h3>
                      </Link>

                      <div className="shrink-0">
                        {isAvailable && (
                          <span className="rounded-full bg-[#e4eee2] px-2.5 py-1 text-xs font-semibold text-[#3f6741]">
                            Available
                          </span>
                        )}

                        {isSold && (
                          <span className="rounded-full bg-[#efe1dd] px-2.5 py-1 text-xs font-semibold text-[#8a3f32]">
                            Sold
                          </span>
                        )}

                        {isNotForSale && (
                          <span className="rounded-full bg-[#ebe7e2] px-2.5 py-1 text-xs font-semibold text-[#665f58]">
                            Not for Sale
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ARTIST PROFILE */}
                    <div className="mt-4 flex items-center gap-3 border-t border-[#eee5db] pt-4">

                      {artist?.photo_url ? (
                        <img
                          src={artist.photo_url}
                          alt={artist.name ?? 'Artist'}
                          className="h-12 w-12 shrink-0 rounded-full border-2 border-[#e4d3c5] bg-[#eee7dd] object-cover"
                          style={{
                            objectPosition: artistPhotoPosition,
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eee7dd] text-xl">
                          🎨
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#9a8d82]">
                          Created by
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#514840]">
                          {artist?.name ?? 'Artist'}
                        </p>
                      </div>
                    </div>

                    {/* MEDIUM AND SIZE */}
                    {(artwork.medium || artwork.size) && (
                      <p className="mt-4 text-xs tracking-wide text-[#81766c]">
                        {artwork.medium}
                        {artwork.medium && artwork.size && ' • '}
                        {artwork.size}
                      </p>
                    )}

                    {/* PRICE */}
                    {artwork.for_sale &&
                      artwork.price != null && (
                        <div className="mt-4 border-t border-[#eee5db] pt-3">
                          <p className="font-serif text-lg font-semibold text-[#653426]">
                            ₹{Number(artwork.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      )}

                    {/* ALIGN BUTTONS AT CARD BOTTOM */}
                    <div className="flex-1" />

                    {/* LIKE AND COMMENT */}
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#eee5db] pt-4">
                      <LikeButton
                        artworkId={artwork.id}
                        initialLikes={
                          likeCounts.get(artwork.id) ?? 0
                        }
                      />

                      <GalleryCommentButton
                        artworkId={artwork.id}
                      />
                    </div>

                    {/* VIEW DETAILS */}
                    <Link
                      href={`/art/${artwork.slug}`}
                      className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-[#8d4a36] hover:underline"
                    >
                      View artwork details
                      <span aria-hidden="true">→</span>
                    </Link>

                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          !error && (
            <div className="rounded-xl border border-[#d8c9b9] bg-[#fffdf9] px-6 py-16 text-center">
              <p className="font-serif text-xl">
                The exhibition is being prepared.
              </p>

              <p className="mt-2 text-sm text-[#766b62]">
                Artworks will appear here soon.
              </p>
            </div>
          )
        )}

        {/* FOOTER */}
        <footer className="mt-12 border-t border-[#d8c9b9] pt-6 text-center">
          <p className="text-xs tracking-[0.15em] text-[#9a8d82]">
            PWF DURGA PUJA • ART EXHIBITION
          </p>

          <p className="mt-2 font-serif text-sm text-[#8d4a36]">
            শিল্প • সৃষ্টি • উৎসব
          </p>
        </footer>

      </div>
    </main>
  )
}
