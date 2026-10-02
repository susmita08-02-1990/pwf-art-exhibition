'use client'

import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'

type BuyerActionsProps = {
  artworkId: number
  artworkTitle: string
  phone: string
  forSale: boolean
  isAvailable: boolean
  acceptsCustomOrder: boolean
}

type InterestType = 'buy' | 'custom_order'

export default function BuyerActions({
  artworkId,
  artworkTitle,
  phone,
  forSale,
  isAvailable,
  acceptsCustomOrder,
}: BuyerActionsProps) {

  const [interestType, setInterestType] =
    useState<InterestType | null>(null)

  const [name, setName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const digitsOnly = phone.replace(/\D/g, '')

  const whatsappPhone =
    digitsOnly.length === 10
      ? `91${digitsOnly}`
      : digitsOnly

  function startEnquiry(type: InterestType) {
    setInterestType(type)
    setName('')
    setBuyerPhone('')
    setErrorMessage('')
  }

  async function submitEnquiry(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (!interestType) return

    const trimmedName = name.trim()
    const trimmedPhone = buyerPhone.trim()

    if (!trimmedName || !trimmedPhone) {
      setErrorMessage(
        'Please enter your name and phone number.'
      )
      return
    }

    setLoading(true)
    setErrorMessage('')

    const { error } = await supabase
      .from('buying_interests')
      .insert({
        artwork_id: artworkId,
        interest_type: interestType,
        buyer_name: trimmedName,
        buyer_phone: trimmedPhone,
      })

    if (error) {
      console.error(error)
      setErrorMessage(
        'Unable to submit your enquiry. Please try again.'
      )
      setLoading(false)
      return
    }

    const message =
      interestType === 'buy'
        ? `Hi, I am ${trimmedName}. I saw "${artworkTitle}" at the PWF Art Exhibition and I am interested in buying this artwork.`
        : `Hi, I am ${trimmedName}. I saw "${artworkTitle}" at the PWF Art Exhibition and would like to discuss a custom artwork.`

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
      '_blank'
    )

    setInterestType(null)
    setLoading(false)
  }

  if (!whatsappPhone) {
    return null
  }

  return (
    <div>

      {/* Main buttons */}

      {!interestType && (
        <>
          {isAvailable && forSale && (
            <button
              onClick={() => startEnquiry('buy')}
              className="mt-5 block w-full rounded-lg bg-[#743d2c] px-5 py-3 font-semibold text-white"
            >
              Interested in Buying
            </button>
          )}

          {acceptsCustomOrder && (
            <button
              onClick={() =>
                startEnquiry('custom_order')
              }
              className="mt-3 block w-full rounded-lg border border-[#743d2c] px-5 py-3 font-semibold text-[#743d2c]"
            >
              Request a Custom Order
            </button>
          )}
        </>
      )}

      {/* Enquiry form */}

      {interestType && (
        <form
          onSubmit={submitEnquiry}
          className="mt-5 rounded-lg border border-[#dfd0c1] bg-[#fffdf9] p-4"
        >

          <p className="font-serif text-lg font-semibold text-[#653426]">
            {interestType === 'buy'
              ? 'Interested in this artwork?'
              : 'Request a Custom Order'}
          </p>

          <p className="mt-1 text-sm text-[#766b62]">
            Enter your details and continue to WhatsApp.
          </p>

          <label className="mt-4 block text-sm font-medium">
            Your Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Name"
            maxLength={100}
            className="mt-1 w-full rounded-lg border border-[#d8c9b9] bg-white p-3"
          />

          <label className="mt-4 block text-sm font-medium">
            Phone Number
          </label>

          <input
            type="tel"
            value={buyerPhone}
            onChange={(e) =>
              setBuyerPhone(e.target.value)
            }
            placeholder="Phone number"
            maxLength={20}
            className="mt-1 w-full rounded-lg border border-[#d8c9b9] bg-white p-3"
          />

          {errorMessage && (
            <p className="mt-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-[#743d2c] px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? 'Submitting...'
              : 'Continue to WhatsApp'}
          </button>

          <button
            type="button"
            onClick={() =>
              setInterestType(null)
            }
            className="mt-3 w-full text-sm text-[#766b62] underline"
          >
            Cancel
          </button>

        </form>
      )}

    </div>
  )
}