import React, { useContext, useEffect, useMemo, useState } from 'react'
import Style from './Checkout.module.css'
import Header from '../Header/Header'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { globalContext } from '../../context API/ContextProvider'
import { toast } from 'react-toastify'
import axios from 'axios'
import BackButton from '../MobileComp/BackButton'
import MobileNavBar from '../MobileComp/MobileNavBar'

const Checkout = () => {
  const navigate = useNavigate();
  const { cartData, userData, setLoading, setCartData } = useContext(globalContext);
  const [curProduct, setCurProduct] = useState({ ...cartData[0].product })
  const [checkoutData, setCheckoutData] = useState({
    deliveryAdd: '',
    paymentMethod: '',
    products: [],
    totalPrice: '',
    totalAmount: ''
  })

  const cartTotalPrice = useMemo(() => {
    let value = 0;
    cartData.forEach(element => {
      if (element.totalPrice) {
        value += element.totalPrice;
      }
    });
    return value
  }, [cartData])

  useEffect(() => {
    setCheckoutData({ ...checkoutData, products: cartData, totalPrice: cartTotalPrice, totalAmount: cartTotalPrice + 45 })
  }, [])

  const submitHandler = async () => {
    setLoading(true)
    try {
      if (!checkoutData.deliveryAdd || !checkoutData.paymentMethod) {
        toast.error('Delivery address or delivery method missing');
      } else {
        const { data } = await axios.post('https://musicart-backend-c8rh.onrender.com/api/invoice/add', {
          ...checkoutData
        }, {
          headers: {
            Authorization: localStorage.getItem('jwtToken')
          }
        })
        toast.success(data.message)
        setCartData([])
        navigate('/order-success')
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
    setLoading(false)

  }

  return (
    <>
      <Header pathName={'Home/ Checkout'} />
      <BackButton path="/cart" text='Back to cart' />
      <div className={Style.checkoutContainer}>
        <h1>Checkout</h1>
        <div>
          <div className={Style.left}>
            <div>
              <h2>1. Delivery address</h2>
              <div>
                <p>{userData.name}</p>
                <textarea
                  onChange={(e) => { setCheckoutData({ ...checkoutData, deliveryAdd: e.target.value }) }}></textarea>
              </div>
            </div>
            <div>
              <h2>2. Payment method</h2>
              <div>
                <select
                  onChange={(e) => { setCheckoutData({ ...checkoutData, paymentMethod: e.target.value }) }}
                  name="paymentMethod" id="">
                  <option value="">Payment method</option>
                  <option value="Pay on Delivery">Pay on Delivery</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>
            <div>
              <h2>3. Review items and delivery</h2>
              <div>
                <div>
                  {
                    cartData.map((data, i) => (
                      <img key={i} src={data.product.images[0]} onClick={() => { setCurProduct(data.product) }} alt={(data.product.name).split(',')[0]} />
                    ))
                  }
                </div>
                <h1>{(curProduct.name).split(',')[0]}</h1>
                <p>colour: {curProduct.color}</p>
                <p>{curProduct.availability}</p>
                <h2>Estimated delivery : Monday — FREE Standard Delivery</h2>
              </div>
            </div>
            <div>
              <button onClick={submitHandler}>Place your order</button>
              <div>
                <h2>Order Total : ₹{cartTotalPrice + 45}.00 </h2>
                <h3>By placing your order, you agree to Musicart privacy notice and conditions of use.</h3>
              </div>
            </div>
          </div>
          <div className={Style.right}>
            <button onClick={submitHandler}>Place your order</button>
            <p>By placing your order, you agree to Musicart privacy notice and conditions of use.</p>
            <h1>Order Summary</h1>
            <h3><span>Items : </span><span>₹{cartTotalPrice}.00</span></h3>
            <h3><span>Delivery :</span><span>₹45.00</span></h3>
            <h2><span>Order Total :</span><span>₹{cartTotalPrice + 45}.00</span></h2>
          </div>
        </div>
      </div>
      <div className='footer'><Footer /></div>
      <MobileNavBar />
    </>
  )
}

export default Checkout
