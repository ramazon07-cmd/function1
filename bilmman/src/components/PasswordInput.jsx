import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Password field with a show/hide toggle; every other prop goes to the <input>.
export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="password-field">
      <input {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className="password-field__toggle"
        aria-label={visible ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
}
