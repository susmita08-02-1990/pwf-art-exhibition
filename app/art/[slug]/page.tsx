import { supabase } from '@/lib/supabase'
import LikeButton from '@/components/LikeButton'
import CommentBox from '@/components/CommentBox'

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Get artwork + artist information
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select(`
      *,
      artists (
        name,
        phone,
        tower,
        apartment,
        instagram_url,
        linkedin_url,
        photo_url
      )
    `)
    .eq('slug', slug)
    .single()

  // Stop here if artwork does not exist
  if (error || !artwork) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
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

  // Get number of likes for this artwork
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('artwork_id', artwork.id)

  return (
    <main className="mx-auto max-w-xl p-6">

      {/* Painting title */}
      <h1 className="text-3xl font-bold">
        {artwork.title}
      </h1>

      {/* Artist name */}
      <p className="mt-2 text-lg">
        by {artwork.artists?.name}
      </p>

      {/* Painting image */}
      {artwork.image_url && (
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="mt-6 w-full rounded-lg"
        />
      )}

      {/* Medium and size */}
      <p className="mt-5">
        {artwork.medium} • {artwork.size}
      </p>

      {/* Like button */}
      <LikeButton
        artworkId={artwork.id}
        initialLikes={likeCount ?? 0}
      />

      {/* Story */}
      <section className="mt-8">

        <h2 className="text-xl font-semibold">
          Story Behind the Painting
        </h2>

        <p className="mt-2">
          {artwork.story}
        </p>

      </section>

      {/* Availability */}
      <section className="mt-8">

        <h2 className="text-xl font-semibold">
          Availability
        </h2>

        <p className="mt-2 capitalize">
          {artwork.status?.replaceAll('_', ' ')}
        </p>

        {artwork.for_sale && artwork.price && (
          <p className="mt-1 text-xl font-bold">
            ₹{Number(artwork.price).toLocaleString('en-IN')}
          </p>
        )}

        {artwork.accepts_custom_order && (
          <p className="mt-3">
            🎨 Custom orders accepted
          </p>
        )}

        {artwork.commission_note && (
          <p className="mt-1">
            {artwork.commission_note}
          </p>
        )}

      </section>

      {/* Artist information */}
      <section className="mt-8">

        <h2 className="text-xl font-semibold">
          Artist
        </h2>

        <p className="mt-2 font-semibold">
          {artwork.artists?.name}
        </p>

        <p>
          {artwork.artists?.tower}
          {' • '}
          Apartment {artwork.artists?.apartment}
        </p>

        <p className="mt-2">
          📞 {artwork.artists?.phone}
        </p>

      </section>

      {/* Private comment box */}
      <CommentBox artworkId={artwork.id} />

    </main>
  )
}