import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import Signup from './components/AuthComp/Signup';
import Home from './components/Home';
import Signin from './components/AuthComp/Signin';
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { globalContext } from './context API/ContextProvider';
import Loader from './components/globalLoader/Loader';
import ProductDetails from './components/Products/ProductDetails';
import Cart from './components/Cart/Cart';
import Checkout from './components/Order/Checkout';
import Invoice from './components/Order/Invoice';
import InvoiceDetail from './components/Order/InvoiceDetail';
import SkelatonLoader from './components/globalLoader/SkelatonLoader';
import Successfull from './components/Order/Successfull';
import Auth from './Auth';
import axios from 'axios';


function App() {
  const { loading, setLoading, isAuthenticated, setCartData, setUserData, setProductLoader, setProducts } = useContext(globalContext)

  const loadUser = async () => {
    setLoading(true);

    try {
      const user = await axios.get('https://musicart-backend-c8rh.onrender.com/api/user/load-user', {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
      setUserData(user.data.user);

      const { data } = await axios.get('https://musicart-backend-c8rh.onrender.com/api/cart/get-cart', {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
      setCartData(data.products);
    } catch (error) {
      console.log(error.response.data.error)
      // toast.error(error.response.data.error); 
    }

    setLoading(false)
  }

  const getProducts = async () => {
    setProductLoader(true)
    const { data } = await axios.get('https://musicart-backend-c8rh.onrender.com/api/product/get-all', {
      headers: {
        authorization: localStorage.getItem('jwtToken')
      }
    });
    setProducts(data);
    setProductLoader(false)
  }


  useEffect(() => {
    loadUser()
    getProducts()
  }, [isAuthenticated])

  return (
    <>
      {loading && <Loader />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Auth><Cart /></Auth>} />
        <Route path='/checkout' element={<Auth><Checkout /></Auth>} />
        <Route path='/order-success' element={<Auth><Successfull /></Auth>} />
        <Route path='/invoice' element={<Auth><Invoice /></Auth>} />
        <Route path='/invoice-detail' element={<Auth><InvoiceDetail /></Auth>} />
        <Route path='/loader' element={<SkelatonLoader />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2500}
      />
    </>
  )
}

export default App
