import React from 'react'
import './AppDevelopment.css'
import { assets } from '../../assets/assets'
const AppDevelopment = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>For a better experience, download the <br />
          FoodieGo app today and enjoy fast delivery, <br />
          exclusive offers, and a smoother ordering process.</p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="" />
        <img src={assets.app_store} alt="" />
      </div>
    </div>
  )
}

export default AppDevelopment
