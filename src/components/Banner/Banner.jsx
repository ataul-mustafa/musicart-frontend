import React from 'react'
import bannerImage from '../../assets/bannerImage.png'
import Style from './Banner.module.css'

const Banner = () => {
    return (
        <div className={Style.bannerContainer}>
            <div>
                <div>Grab upto 50% off on Selected headphones <button>Buy Now</button></div>
                <img src={bannerImage} alt="banner image" />
            </div>
        </div>
    )
}

export default Banner
