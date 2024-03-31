import React, { useContext, useEffect } from 'react'
import { globalContext } from '../context API/ContextProvider';
import Header from './Header/Header';
import Banner from './Banner/Banner';
import SearchAndFilters from './SearchAndFilters/SearchAndFilters';
import Products from './Products/Products';
import { toast } from 'react-toastify';
import axios from 'axios';
import Feedback from './Feedback/Feedback';
import MobileNavBar from './MobileComp/MobileNavBar';

const Home = () => {

    const { setIsAuthenticated, setLoading, setCartData, setSelectedNav, setUserData} = useContext(globalContext) 

    const loadUser = async ()=>{
        setLoading(true);

        try {
            const user = await axios.get('https://musicart-backend-c8rh.onrender.com/api/user/load-user', {
                headers: {
                    Authorization: localStorage.getItem('jwtToken')
                }
            })
            setUserData(user.data.user);
            const {data} = await axios.get('https://musicart-backend-c8rh.onrender.com/api/cart/get-cart', {
                headers: {
                    Authorization: localStorage.getItem('jwtToken')
                }
            })
            setCartData(data.products);
        } catch (error) {
            toast.error(error.response.data.error);
        }

        setLoading(false)
    }

    useEffect(()=>{
        setSelectedNav('home')
        const token = localStorage.getItem('jwtToken');
        if(token){
            setIsAuthenticated(true);
        }
        // loadUser();
    },[])
    
    return (
        <div className='homeContainer' >
           <Header />
           <Banner />
           <SearchAndFilters />
           <Products />
           <Feedback />
           <MobileNavBar />
        </div>
    )
}

export default Home
