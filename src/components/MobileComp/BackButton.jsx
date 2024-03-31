import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import Style from './BackButton.module.css';
import { Link } from 'react-router-dom';

const BackButton = ({path, text}) => {
    return (
        <div className={Style.BackButton}>
            <Link to={path}>{text}</Link>
            <Link to={path}><FaArrowLeftLong className={Style.icon} /></Link>
        </div>
    )
}

export default BackButton
