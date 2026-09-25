'use client'

import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'

type CommentBoxProps = {
  artworkId: number
}

export default function CommentBox({
  artworkId,
}: CommentBoxProps) {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedComment = comment.trim()

    if (!trimmedComment) {
      setErrorMessage('Please write a comment.')
      return
    }

    if (trimmedComment.length > 500) {
      setErrorMessage('Comment must be 500 characters or less.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccess(false)

    const { error } = await supabase
      .from('comments')
      .insert({
        artwork_id: artworkId,
        comment: trimmedComment,
      })

    if (error) {
      console.error(error)
      setErrorMessage('Unable to submit your comment. Please try again.')
      setLoading(false)
      return
    }

    setComment('')
    setSuccess(true)
    setLoading(false)
  }

  return (
    <section className="mt-10 border-t pt-8">
      <h2 className="text-xl font-semibold">
        Leave a Comment
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        Share your thoughts with the artist.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">

        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
            setSuccess(false)
          }}
          maxLength={500}
          rows={4}
          placeholder="Write your comment..."
          className="w-full rounded-lg border p-3"
        />

        <div className="mt-1 text-right text-xs text-gray-500">
          {comment.length}/500
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-3 rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>

      </form>

      {success && (
        <p className="mt-3 text-green-700">
          Thank you! Your comment has been submitted.
        </p>
      )}

      {errorMessage && (
        <p className="mt-3 text-red-600">
          {errorMessage}
        </p>
      )}

    </section>
  )
}