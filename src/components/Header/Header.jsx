import React, { useContext, useEffect, useMemo, useState } from 'react'
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import Style from './Header.module.css'
import Logo from '../Logo/Logo';
import { globalContext } from '../../context API/ContextProvider';
import { IoCartOutline } from "react-icons/io5";
import { FaSearch } from 'react-icons/fa'; // Import the desired icon component
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Header = ({ pathName }) => {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, setSearchValue, setProducts, setProductLoader, cartData, userData } = useContext(globalContext)
    const [name, setName] = useState('A');

    function getFirstLetters(name) {
        const words = name.split(' ');
        let initials = '';
        words.forEach(word => {
            if (word.length > 0) {
                initials += word[0].toUpperCase();
            }
        });
        return initials;
    }

    const noOfCartItems = useMemo(() => {
        let no = 0;
        cartData.forEach((data) => {
            console.log()
            no += data.quantity;
        })
        return no;
    }, [cartData])

    useEffect(() => {
        if (userData.name) {
            setName(getFirstLetters(userData.name));
        }
    }, [userData])

    const logoutHandler = (close) => {
        localStorage.clear();
        setIsAuthenticated(false);
        if (close) {
            close();
        }
        navigate('/')
    }

    const onSearchChange = async (e) => {
        setProductLoader(true);
        try {
            const { data } = await axios.get(`https://musicart-backend-c8rh.onrender.com/api/product/filter?name=${e.target.value}`, {
                headers: {
                    Authorization: localStorage.getItem('jwtToken')
                }
            })
            setProducts(data);
        } catch (error) {
            toast.error(error.response.data.error)
        }
        setProductLoader(false)
        setSearchValue(e.target.value)
    }

    const inputClickHandler = () =>{
        navigate('/')
    }

    return (
        <>
            <div className={Style.wrraper}>
                <div className={Style.headerContainer}>
                    <div><MdOutlinePhoneInTalk /> 7983732026</div>
                    <div>Get 50% off on selected items &nbsp; | &nbsp; Shop Now</div>
                    <div>
                        {
                            !isAuthenticated ?
                                <div>
                                    <Link to={'/sign-in'}>Login </Link> &nbsp; |&nbsp; &nbsp;
                                    <Link to={'/sign-up'}>Signup</Link>
                                </div> :
                                pathName &&
                                <div>
                                    <Link to='/' onClick={logoutHandler} >Logout</Link>
                                </div>

                        }
                    </div>
                </div>
                <div className={Style.logoCart}>
                    <div>
                        <Logo />
                        {
                            pathName ? <p>{pathName}</p> :
                                <div>
                                    <Link to={'/'}>Home</Link>
                                    {
                                        isAuthenticated &&
                                        <Link to={'/invoice'}>Invoice</Link>
                                    }
                                </div>
                        }
                    </div>
                    <div>
                        {
                            isAuthenticated && <>
                                <Link to={'/cart'}><IoCartOutline /> View Cart {noOfCartItems}</Link>
                                {
                                    !pathName &&
                                    // <div><p>{name}</p></div>
                                    <Popup
                                        trigger={<div><p>{name}</p></div>}
                                        position="bottom center"
                                        arrow={false}
                                    >
                                        {
                                            close => (<div className={Style.profileInfo}>
                                                <h1>{userData.name}</h1>
                                                <button onClick={() => { logoutHandler(close) }}>Logout</button>
                                            </div>)
                                        }
                                    </Popup>
                                }
                            </>
                        }
                    </div>
                    <div></div>
                </div>
            </div>

            <div className={Style.mobileHeaderWrapper}>
                <div className={Style.mobileHeader}>
                    <input type="text" onChange={onSearchChange} onClick={inputClickHandler} placeholder='Search Musicart' />
                    <FaSearch />
                </div>
            </div>
        </>
    )
}

export default Header
