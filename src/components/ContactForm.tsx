'use client'

import Script from 'next/script'
import { useState, type FormEvent } from 'react'
import { TURNSTILE_SITEKEY, firm } from '@/lib/content'
import Arrow from './Arrow'

const INTERESTS = ['Selling a business', 'Investment banker / intermediary', 'Investor relations', 'Careers', 'General inquiry']

/**
 * Posts to /api/contact, the same Cloudflare Pages Function the current site uses
 * (it verifies the Turnstile token, then sends the message). See README, "Contact form".
 */
export default function ContactForm({ idPrefix = 'c' }: { idPrefix?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) return void form.reportValidity()
    setState('sending')
    try {
      const r = await fetch('/api/contact', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j.success) throw new Error('bad')
      setState('sent')
    } catch {
      setState('error')
      try {
        ;(window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset()
      } catch {}
    }
  }

  if (state === 'sent') {
    return (
      <p role="status" className="border border-bronze/40 p-8 font-serif text-2xl">
        Thank you. We have received your message and will respond within one business day.
      </p>
    )
  }

  const id = (n: string) => `${idPrefix}-${n}`
  return (
    <form onSubmit={submit} noValidate={false} className="grid gap-7 sm:grid-cols-2">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vein sm:col-span-2">*Required</p>
      <div className="field">
        <label htmlFor={id('first')}>First Name *</label>
        <input id={id('first')} name="firstName" autoComplete="given-name" required />
      </div>
      <div className="field">
        <label htmlFor={id('last')}>Last Name *</label>
        <input id={id('last')} name="lastName" autoComplete="family-name" required />
      </div>
      <div className="field">
        <label htmlFor={id('email')}>Email *</label>
        <input id={id('email')} name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor={id('phone')}>Phone Number</label>
        <input id={id('phone')} name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor={id('interest')}>Area of Interest *</label>
        <select id={id('interest')} name="interest" required defaultValue="">
          <option value="" disabled>
            Select an option
          </option>
          {INTERESTS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor={id('msg')}>Message *</label>
        <textarea id={id('msg')} name="message" required />
      </div>
      <div className="cf-turnstile sm:col-span-2" data-sitekey={TURNSTILE_SITEKEY} data-action="contact" data-theme="dark" />
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn--primary" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending' : 'Submit'} <Arrow />
        </button>
      </div>
      {state === 'error' && (
        <p role="alert" className="text-marble sm:col-span-2">
          Something went wrong sending your message. Please email us directly at{' '}
          <a className="text-bronze-hi underline underline-offset-4" href={`mailto:${firm.deals.email}`}>
            deals@teleocapital.com
          </a>
          .
        </p>
      )}
    </form>
  )
}
