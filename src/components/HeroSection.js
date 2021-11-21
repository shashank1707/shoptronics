import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import './HeroSection.css'

function HeroSection() {
  return (
    <div className='hero-container' >
      <h1>Welcome</h1>
      <p>Need a new Laptop or Smartphone?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={() => window.location.replace("/#best-title")}
        >
          START SHOPPING
        </Button>

      </div>
    </div>
  )
}

export default HeroSection
