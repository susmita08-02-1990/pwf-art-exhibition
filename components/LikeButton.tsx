
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type LikeButtonProps = {
  artworkId: number
  initialLikes: number
}

export default function LikeButton({
  artworkId,
  initialLikes,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  const storageKey = `liked-artwork-${artworkId}`

  useEffect(() => {
    const alreadyLiked = localStorage.getItem(storageKey)

    setLiked(alreadyLiked === 'true')
    setReady(true)
  }, [storageKey])

  useEffect(() => {
    setLikes(initialLikes)
  }, [initialLikes])

  async function handleLike() {
    if (liked || loading || !ready) return

    setLoading(true)

    const { error } = await supabase
      .from('likes')
      .insert({
        artwork_id: artworkId,
      })

    if (!error) {
      setLikes((currentLikes) => currentLikes + 1)
      setLiked(true)
      localStorage.setItem(storageKey, 'true')
    } else {
      console.error('Like error:', error.message)
    }

    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || loading || !ready}
      className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-[#d8c9b9] px-4 text-sm font-medium text-[#653426] transition hover:bg-[#f5f0e8] disabled:opacity-60"
    >
      {liked ? '❤️ Liked' : '♡ Like'} · {likes}
    </button>
  )
}
