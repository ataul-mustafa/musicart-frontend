import React from 'react'
import confetti from '../../assets/confetti.png';
import { Link } from 'react-router-dom';
import Style from './Successfull.module.css'
import Header from '../Header/Header';
import Logo from '../Logo/Logo';
import Footer from '../Footer/Footer';
import MobileNavBar from '../MobileComp/MobileNavBar';

const Successfull = () => {
    return (
        <>
            <div className={Style.logo}><Logo /></div>
            <div className={Style.confetti}>
                <div>
                    <img src={confetti} alt="Order placed successfully" />
                    <h1>Order placed successfully</h1>
                    <h3>You will be receiving a confirmation email with order details</h3>
                    <Link to={'/'}>Go back to Home page</Link>
                </div>
            </div>
            <div className='footer'><Footer /></div>
            <MobileNavBar />
        </>
    )
}

export default Successfull
