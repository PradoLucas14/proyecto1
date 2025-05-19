import React from 'react'
import "./Hero.css"
import logoPartido from '../../assets/images/img3.png'; 

function Hero() {
  return (
    <div className='Hero'>
      <div className='HeroOverlay'>
        <div className="HeroText">
          <img src={logoPartido} alt="Logo del Partido" className="hero-logo" />
          <h1 className="hero-title">¡Únete a nosotros y construye el futuro!</h1>
          <p className="hero-slogan">Tu voz, nuestro compromiso.</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
