import React, { useContext, useEffect, useState } from 'react'
import { globalContext } from '../../context API/ContextProvider'
import axios from 'axios';
import Style from './Products.module.css';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom'
import { MdAddShoppingCart } from "react-icons/md";
import { toast } from 'react-toastify';
import SkelatonLoader from '../globalLoader/SkelatonLoader';

const Products = () => {
  const { products, setLoading, setProducts, productLoader, setProductLoader, cartData, setCartData, prodViewMode } = useContext(globalContext)

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

  const addToCart = async (product) => {
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5500/api/cart/add', {
        product
      }, {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })

      setCartData(data.products)
      toast.success("Product added into cart")
    } catch (error) {
      toast.error(error.response.data.error);
    }

    setLoading(false)
  }

  // useEffect(() => {
  //   getProducts();
  // }, [])
  return (
    <>
      {
        !productLoader ?
          <>
            {
              products.length > 0 ?
                <>
                  {
                    prodViewMode == 'grid' ?
                      <div className={Style.productsContainer}>
                        <div>
                          {
                            products && products.map((product, i) => (
                              <Link to={`product/${product._id}`} key={i} >
                                <div>
                                  <img src={product.images[0]} alt={(product.name).split(',')[0]} />
                                  <MdAddShoppingCart onClick={() => { addToCart(product) }} className={Style.cartIcon} />
                                </div>
                                <h2>{(product.name).split(',')[0]}</h2>
                                <h3>Price - ₹ {product.price}</h3>
                                <h3>{`${product.color} | ${product.headPhoneType}`}</h3>
                              </Link>
                            ))
                          }
                        </div>
                      </div> :
                      <div className={Style.listContainer}>
                        {
                          products && products.map((product, i) => (
                            <div key={i}>
                              <div>
                                <img src={product.images[0]} alt={(product.name).split(',')[0]} />
                                <MdAddShoppingCart onClick={() => { addToCart(product) }} className={Style.cartIcon} />
                              </div>
                              <div>
                                <h1>{(product.name).split(',')[0]}</h1>
                                <h3>Price - ₹ {product.price}</h3>
                                <h2>{`${product.color} | ${product.headPhoneType}`}</h2>
                                <h2>{product.name}</h2>
                                <Link to={`product/${product._id}`}>
                                  Details
                                </Link>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                  }
                </> :
                <div className={Style.noProducts}>No products found</div>
            }
            <Footer />
          </> :
          <SkelatonLoader />
      }
    </>
  )
}

export default Products
