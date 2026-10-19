
'use client'

import { useEffect, useState } from 'react'
import CommentBox from '@/components/CommentBox'

type Props = {
  artworkId: number
}

export default function GalleryCommentButton({
  artworkId,
}: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-[#d8c9b9] px-4 text-sm font-medium text-[#653426] transition hover:bg-[#f5f0e8]"
      >
        💬 Comment
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Leave a comment"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-xl font-semibold text-[#29231f]">
                Appreciate the Artwork
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close comment form"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-2xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <CommentBox artworkId={artworkId} />
          </div>
        </div>
      )}
    </>
  )
}
