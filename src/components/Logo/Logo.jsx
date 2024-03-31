import React from 'react'
import Style from './Logo.module.css';
import logo from '../../assets/logo.png'

const Logo = () => {
  return (
    <div className={Style.logoContainer} >
      <img src={logo} alt="musicart" />
      <h1>Musicart</h1>
    </div>
  )
}

export default Logo
