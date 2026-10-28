import React from 'react'
import { LoaderCircle, LockKeyhole, SearchX, TriangleAlert } from 'lucide-react'
import '../styles/teststate.css'

const ICONS = {
  loading: <LoaderCircle size={30} className="test-state__spin" />,
  locked: <LockKeyhole size={30} />,
  error: <TriangleAlert size={30} />,
  missing: <SearchX size={30} />,
}

// Full-page status screen for the test player: checking access, locked, failed, not found.
export default function TestState({ variant, title, text, actionLabel, onAction }) {
  return (
    <main className="test-state">
      <section className={`test-state__card test-state__card--${variant}`} role={variant === 'loading' ? 'status' : 'alert'}>
        <div className="test-state__icon" aria-hidden="true">{ICONS[variant]}</div>
        <h1>{title}</h1>
        {text ? <p>{text}</p> : null}
        {actionLabel ? <button type="button" onClick={onAction}>{actionLabel}</button> : null}
      </section>
    </main>
  )
}
