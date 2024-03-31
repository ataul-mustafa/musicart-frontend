import React, { useContext, useEffect, useState } from 'react'
import { globalContext } from '../../context API/ContextProvider'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Header from '../Header/Header';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Style from './ProductDetails.module.css';
import ReactStars from "react-rating-stars-component";
import { toast } from 'react-toastify';
import BackButton from '../MobileComp/BackButton'
import MobileNavBar from '../MobileComp/MobileNavBar'
import Footer from '../Footer/Footer';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { setLoading, setCartData } = useContext(globalContext)
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);

    const getImages = (imges) => {
        const imgs = [];
        imges.forEach((img) => {
            imgs.push({
                original: img,
                thumbnail: img,
            })
        })
        setImages(imgs)
    }

    const getProduct = async () => {
        setLoading(true)
        const { data } = await axios.get(`http://localhost:5500/api/product/get-one/${id}`, {
            headers: {
                authorization: localStorage.getItem('jwtToken')
            }
        });
        getImages(data?.images)
        setProduct(data);
        setLoading(false)
    }

    useEffect(() => {
        getProduct();
    }, [])

    const addToCart = async ()=>{
        setLoading(true);

        try {
            const {data} = await axios.post('https://musicart-backend-c8rh.onrender.com/api/cart/add', {
                product
            }, {
                headers: {
                    Authorization: localStorage.getItem('jwtToken')
                }
            })

            setCartData(data.products)
            toast.success("Product added into cart")
        } catch (error) {
            navigate('/sign-in')
            toast.error(error.response.data.error);
        }

        setLoading(false)
    }

    // console.log(product.rating)

    return (
        <div className={Style.prDetailsCont}>
            <Header pathName={`Home/ ${product?.name?.split(',')[0]}`} />
            <BackButton path={'/'} text={'Back to products'} />
            <div className={Style.prdDetailWrapper}>
                <button onClick={()=>{navigate('/cart')}} className={Style.btn2}>Buy Now</button>
                <h2>{product.name}</h2>
                <div>
                    <div className={Style.images}>
                        {
                            product &&
                            <ImageGallery items={images}
                                showNav={false} // Hide navigation arrows
                                showFullscreenButton={false} // Hide fullscreen button
                                showPlayButton={true} // Hide play button
                                showBullets={true} // Hide bullets
                                thumbnailClass={Style.thumbnail}
                                originalClass={Style.originalImg}
                            />
                        }
                    </div>
                    <div className={Style.desc}>
                        <h1>{(product?.name)?.split(',')[0]}</h1>
                        <div>
                            { product.rating && <ReactStars
                                value={product.rating}
                                count={5}
                                isHalf={true}
                                size={28}
                            /> }
                            <p>{`(${product.noOfReviews} Customer Reviews)`}</p>
                        </div>
                        <h2 className={Style.prdName}>{product.name}</h2>
                        <h2>Price - ₹ {product.price}</h2>
                        <h3>{product.color} | {product.headPhoneType}</h3>
                        <ul>
                            <p>About this item</p>
                            {
                                product?.description?.map((item, i)=>(
                                    <li key={i}>{item}</li>
                                ))
                            }
                        </ul>
                        <h4>Available - <span>{product.availability}</span></h4>
                        <h4>Brand - <span>{product.brand}</span></h4>
                        <button onClick={addToCart} className={Style.btn1}>Add to cart</button>
                        <button onClick={()=>{navigate('/cart')}} className={Style.btn2}>Buy Now</button>
                    </div>
                </div>
            </div>
            <div className='footer'><Footer /></div>
            <MobileNavBar />
        </div>
    )
}

export default ProductDetails
