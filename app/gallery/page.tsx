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
      medium,
      size,
      status,
      for_sale,
      price,
      display_order,
      artists (
        name
      )
    `)
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })

  const totalArtworks = artworks?.length ?? 0

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#29231f]">

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-12">

        {/* ====================================== */}
        {/* EXHIBITION IDENTITY */}
        {/* ====================================== */}

        <header className="mb-9 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#653426] sm:text-base">
            Pashmina Waterfront
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-wide text-[#29231f] sm:text-4xl">
            Art Exhibition
          </h1>

          {/* Divider */}
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
            Tap any artwork to explore its story and meet the artist.
          </p>

        </header>


        {/* ====================================== */}
        {/* GALLERY HEADING */}
        {/* ====================================== */}

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


        {/* ====================================== */}
        {/* ARTWORK GRID */}
        {/* ====================================== */}

        {totalArtworks > 0 ? (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {artworks?.map((artwork, index) => {

              const isAvailable =
                artwork.status === 'available'

              const isSold =
                artwork.status === 'sold'

              const isNotForSale =
                artwork.status === 'not_for_sale'

              return (

                <Link
                  key={artwork.id}
                  href={`/art/${artwork.slug}`}
                  className="group overflow-hidden rounded-xl border border-[#d8c9b9] bg-[#fffdf9] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >

                  {/* Painting */}
                  <div className="relative bg-[#eee7dd] p-2">

                    {artwork.image_url ? (

                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-[1.015]"
                      />

                    ) : (

                      <div className="flex aspect-[4/5] items-center justify-center text-sm text-[#81766c]">
                        Artwork image
                      </div>

                    )}


                    {/* Artwork number */}
                    <span className="absolute left-4 top-4 rounded-full bg-[#fffdf9]/95 px-3 py-1 text-xs font-semibold text-[#653426] shadow-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                  </div>


                  {/* Artwork details */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="font-serif text-xl leading-tight text-[#29231f]">
                          {artwork.title}
                        </h3>

                        <p className="mt-1 text-sm text-[#766b62]">
                          by{' '}
                          <span className="font-medium text-[#514840]">
                            {artwork.artists?.name}
                          </span>
                        </p>

                      </div>


                      {/* Status */}
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


                    {/* Medium / Size */}
                    {(artwork.medium || artwork.size) && (

                      <p className="mt-3 text-xs tracking-wide text-[#81766c]">

                        {artwork.medium}

                        {artwork.medium &&
                          artwork.size &&
                          ' • '}

                        {artwork.size}

                      </p>

                    )}


                    {/* Price */}
                    {artwork.for_sale &&
                      artwork.price && (

                        <div className="mt-4 border-t border-[#eee5db] pt-3">

                          <p className="font-serif text-lg font-semibold text-[#653426]">
                            ₹
                            {Number(
                              artwork.price
                            ).toLocaleString('en-IN')}
                          </p>

                        </div>

                      )}

                  </div>

                </Link>

              )
            })}

          </div>

        ) : (

          <div className="rounded-xl border border-[#d8c9b9] bg-[#fffdf9] px-6 py-16 text-center">

            <p className="font-serif text-xl">
              The exhibition is being prepared.
            </p>

            <p className="mt-2 text-sm text-[#766b62]">
              Artworks will appear here soon.
            </p>

          </div>

        )}


        {/* ====================================== */}
        {/* FOOTER */}
        {/* ====================================== */}

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