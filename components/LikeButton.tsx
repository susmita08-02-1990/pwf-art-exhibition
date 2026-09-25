'use client'

import { useState } from 'react'
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

  async function handleLike() {
    if (liked || loading) return

    setLoading(true)

    const { error } = await supabase
      .from('likes')
      .insert({
        artwork_id: artworkId,
      })

    if (!error) {
      setLikes(likes + 1)
      setLiked(true)
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className="mt-5 rounded-full border px-5 py-2 text-lg"
    >
      {liked ? '❤️ Liked' : '♡ Like'} · {likes}
    </button>
  )
}