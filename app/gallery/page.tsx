import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function GalleryPage() {

  const { data: artworks } = await supabase
    .from('artworks')
    .select(`
      id,
      slug,
      title,
      image_url,
      display_order,
      artists (
        name
      )
    `)
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })

  return (
    <main className="mx-auto max-w-5xl p-6">

      <h1 className="text-3xl font-bold">
        PWF Art Exhibition
      </h1>

      <p className="mt-2 text-gray-600">
        Explore the artworks
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {artworks?.map((artwork, index) => (
          <Link
            key={artwork.id}
            href={`/art/${artwork.slug}`}
            className="overflow-hidden rounded-xl border"
          >

            {artwork.image_url && (
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="aspect-square w-full object-cover"
              />
            )}

            <div className="p-4">

              <p className="text-xs text-gray-500">
                Artwork {index + 1}
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                {artwork.title}
              </h2>

              <p className="text-sm text-gray-600">
                {artwork.artists?.name}
              </p>

            </div>

          </Link>
        ))}

      </div>

    </main>
  )
}