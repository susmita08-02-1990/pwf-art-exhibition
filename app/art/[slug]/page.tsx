import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LikeButton from '@/components/LikeButton'
import CommentBox from '@/components/CommentBox'
import ViewTracker from '@/components/ViewTracker'
import BuyerActions from '@/components/BuyerActions'

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Get artwork + artist
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
        linkedin_url,
        photo_url
      )
    `)
    .eq('slug', slug)
    .single()

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

  // Get all artworks for exhibition navigation
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
    currentIndex >= 0
      ? currentIndex + 1
      : 1

  const totalArtworks = artworks.length

  // Artwork status
  const isAvailable =
    artwork.status === 'available'

  const isSold =
    artwork.status === 'sold'

  const isNotForSale =
    artwork.status === 'not_for_sale'

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#29231f]">

      {/* Track artwork view */}
      <ViewTracker artworkId={artwork.id} />

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">

        {/* ====================================== */}
        {/* EXHIBITION IDENTITY */}
        {/* ====================================== */}

        <header className="mb-8 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#653426] sm:text-base">
            Pashmina Waterfront
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-wide text-[#29231f] sm:text-4xl">
            Art Exhibition
          </h2>

          {/* Divider */}
          <div className="mx-auto mt-4 flex max-w-[260px] items-center gap-3">

            <span className="h-px flex-1 bg-[#b98570]" />

            <span className="h-2 w-2 rotate-45 border border-[#9a5944]" />

            <span className="h-px flex-1 bg-[#b98570]" />

          </div>

          <p className="mt-4 font-serif text-xl font-medium tracking-[0.08em] text-[#8d4a36] sm:text-2xl">
            শিল্প • সৃষ্টি • উৎসব
          </p>

        </header>


        {/* ====================================== */}
        {/* ARTWORK CARD */}
        {/* ====================================== */}

        <article className="overflow-hidden rounded-2xl border border-[#d8c9b9] bg-[#fffdf9] shadow-sm">

          {/* Top navigation */}
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


          {/* ====================================== */}
          {/* PAINTING */}
          {/* ====================================== */}

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

            {/* ====================================== */}
            {/* ARTWORK INFORMATION */}
            {/* ====================================== */}

            <div className="text-center">

              <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
                {artwork.title}
              </h1>

              <p className="mt-2 text-base text-[#766b62]">

                by{' '}

                <span className="font-medium text-[#453b34]">
                  {artwork.artists?.name}
                </span>

              </p>

              <p className="mt-3 text-sm tracking-wide text-[#81766c]">

                {artwork.medium}

                {artwork.size &&
                  `  •  ${artwork.size}`}

                {artwork.year &&
                  `  •  ${artwork.year}`}

              </p>

            </div>


            {/* Like */}
            <div className="mt-5 flex justify-center">

              <LikeButton
                artworkId={artwork.id}
                initialLikes={likeCount ?? 0}
              />

            </div>


            {/* ====================================== */}
            {/* STORY */}
            {/* ====================================== */}

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


            {/* ====================================== */}
            {/* BUYER EXPERIENCE */}
            {/* ====================================== */}

            <section className="mt-9 rounded-xl border border-[#dfd0c1] bg-[#faf6f0] p-5">

              <div className="flex items-start justify-between gap-4">

                {/* Availability */}
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


                {/* Price */}
                {artwork.for_sale &&
                  artwork.price && (

                    <div className="text-right">

                      <p className="text-xs text-[#81766c]">
                        Price
                      </p>

                      <p className="mt-1 font-serif text-2xl font-semibold text-[#653426]">
                        ₹
                        {Number(
                          artwork.price
                        ).toLocaleString('en-IN')}
                      </p>

                    </div>

                  )}

              </div>


              {/* ====================================== */}
              {/* TRACKED BUY / CUSTOM ORDER BUTTONS */}
              {/* ====================================== */}

              <BuyerActions
                artworkId={artwork.id}
                artworkTitle={artwork.title}
                phone={artwork.artists?.phone || ''}
                forSale={artwork.for_sale}
                isAvailable={isAvailable}
                acceptsCustomOrder={
                  artwork.accepts_custom_order
                }
              />


              {/* Commission note */}
              {artwork.commission_note && (

                <p className="mt-3 text-center text-sm text-[#766b62]">
                  {artwork.commission_note}
                </p>

              )}


              {/* Call artist */}
              {artwork.artists?.phone && (

                <a
                  href={`tel:${artwork.artists.phone}`}
                  className="mt-4 block text-center text-sm font-medium text-[#743d2c] underline"
                >
                  Call Artist
                </a>

              )}

            </section>


            {/* ====================================== */}
            {/* ====================================== */}
{/* ARTIST PROFILE */}
{/* ====================================== */}

<section className="mt-9 border-t border-[#e7ddd2] pt-7">

  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a5944]">
    The Artist
  </p>

  <div className="mt-4 flex items-start gap-4">

    {/* Artist photo */}
    {artwork.artists?.photo_url && (
      <img
        src={artwork.artists.photo_url}
        alt={artwork.artists.name}
        className="h-20 w-20 shrink-0 rounded-full object-cover"
      />
    )}

    <div>

      <p className="font-serif text-xl font-semibold">
        {artwork.artists?.name}
      </p>

      {(artwork.artists?.tower ||
        artwork.artists?.apartment) && (
        <p className="mt-1 text-sm text-[#766b62]">

          {artwork.artists?.tower}

          {artwork.artists?.tower &&
            artwork.artists?.apartment &&
            ' • '}

          {artwork.artists?.apartment &&
            `Apartment ${artwork.artists.apartment}`}

        </p>
      )}

    </div>

  </div>


  {/* Bio */}

  {artwork.artists?.bio && (
    <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-[#514840]">
      {artwork.artists.bio}
    </p>
  )}


  {/* Contact */}

  <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium text-[#743d2c]">

    {artwork.artists?.phone && (
      <a href={`tel:${artwork.artists.phone}`}>
        ☎ Call
      </a>
    )}

    {artwork.artists?.instagram_url && (
      <a
        href={artwork.artists.instagram_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram
      </a>
    )}

    {artwork.artists?.linkedin_url && (
      <a
        href={artwork.artists.linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    )}

  </div>

</section>
            {/* ====================================== */}

            <section className="mt-9 border-t border-[#e7ddd2] pt-7">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a5944]">
                The Artist
              </p>

              <p className="mt-3 font-serif text-xl">
                {artwork.artists?.name}
              </p>


              {(artwork.artists?.tower ||
                artwork.artists?.apartment) && (

                <p className="mt-1 text-sm text-[#766b62]">

                  {artwork.artists?.tower}

                  {artwork.artists?.tower &&
                    artwork.artists?.apartment &&
                    ' • '}

                  {artwork.artists?.apartment &&
                    `Apartment ${artwork.artists.apartment}`}

                </p>

              )}

            </section>


            {/* ====================================== */}
            {/* COMMENTS */}
            {/* ====================================== */}

            <CommentBox artworkId={artwork.id} />

          </div>

        </article>


        {/* ====================================== */}
        {/* PREVIOUS / GALLERY / NEXT */}
        {/* ====================================== */}

        <nav className="mt-6">

          <div className="grid grid-cols-3 items-center gap-2">

            {/* Previous */}
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


            {/* Gallery */}
            <Link
              href="/gallery"
              className="text-center text-sm font-medium text-[#743d2c] underline"
            >
              View Gallery
            </Link>


            {/* Next */}
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


        {/* Footer */}
        <p className="mt-8 text-center text-xs tracking-[0.15em] text-[#9a8d82]">
          PWF DURGA PUJA • ART EXHIBITION
        </p>

      </div>

    </main>
  )
}