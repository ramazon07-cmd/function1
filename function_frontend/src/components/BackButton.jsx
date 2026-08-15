import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import '../styles/backbutton.css'

function BackButton({ to }) {
    const navigate = useNavigate()

    const handleClick = (e) => {
        e.preventDefault()
        if (to) navigate(to)
        else navigate(-1)
    }

    return (
        <button className="back-button" onClick={handleClick} aria-label="Back">
            <AiOutlineArrowLeft size={22} />
        </button>
    )
}

export default BackButton
