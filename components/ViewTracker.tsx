'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type ViewTrackerProps = {
  artworkId: number
}

export default function ViewTracker({
  artworkId,
}: ViewTrackerProps) {

  useEffect(() => {
    const storageKey = `viewed-artwork-${artworkId}`

    const alreadyViewed = localStorage.getItem(storageKey)

    if (alreadyViewed === 'true') {
      return
    }

    async function recordView() {
      const { error } = await supabase
        .from('views')
        .insert({
          artwork_id: artworkId,
        })

      if (!error) {
        localStorage.setItem(storageKey, 'true')
      }
    }

    recordView()

  }, [artworkId])

  return null
}