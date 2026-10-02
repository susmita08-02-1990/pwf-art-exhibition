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

    if (alreadyLiked === 'true') {
      setLiked(true)
    }

    setReady(true)
  }, [storageKey])

  async function handleLike() {
    if (liked || loading) return

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
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading || !ready}
      className="mt-5 rounded-full border px-5 py-2 text-lg disabled:opacity-60"
    >
      {liked ? '❤️ Liked' : '♡ Like'} · {likes}
    </button>
  )
}