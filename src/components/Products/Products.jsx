import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../context API/ContextProvider';
import axios from 'axios';
import Style from './Products.module.css';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import { MdAddShoppingCart } from 'react-icons/md';
import { toast } from 'react-toastify';
import SkelatonLoader from '../globalLoader/SkelatonLoader';
import Pagination from 'react-js-pagination';

const Products = () => {
  const { products, setLoading, productLoader, setCartData, prodViewMode } = useContext(globalContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPrds, setCurrentPrds] = useState(products);

  const addToCart = async (product) => {
    setLoading(true);

    try {
      const { data } = await axios.post('https://musicart-backend-c8rh.onrender.com/api/cart/add', {
        product
      }, {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      });

      setCartData(data.products);
      toast.success('Product added into cart');
    } catch (error) {
      toast.error(error.response.data.error);
    }

    setLoading(false);
  };


  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }

  let count = products.length;

  useEffect(() => {
    if (products.length >= (8*currentPage - 8)) {
      let indexOfLastItem = currentPage * 8;
      const indexOfFirstItem = indexOfLastItem - 8;
      const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
      setCurrentPrds(currentProducts)
    }else{
      setCurrentPrds(products)
    }
  }, [currentPage, products])


  return (
    <>
      {!productLoader ? (
        <>
          {currentPrds.length > 0 ? (
            <>
              {prodViewMode == 'grid' ? (
                <div className={Style.productsContainer}>
                  <div>
                    {currentPrds.map((product, i) => (
                      <Link to={`product/${product._id}`} key={i}>
                        <div>
                          <img src={product.images[0]} alt={(product.name).split(',')[0]} />
                          <MdAddShoppingCart onClick={() => { addToCart(product) }} className={Style.cartIcon} />
                        </div>
                        <h2>{(product.name).split(',')[0]}</h2>
                        <h3>Price - ₹ {product.price}</h3>
                        <h3>{`${product.color} | ${product.headPhoneType}`}</h3>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={Style.listContainer}>
                  {currentPrds.map((product, i) => (
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
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={Style.noProducts}>No products found</div>
          )}
          {count > 7 && (
            <div className='paginationBox'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={8}
                totalItemsCount={products.length}
                onChange={setCurrentPageNo}
                nextPageText=">"
                prevPageText="<"
                firstPageText="1st"
                lastPageText="last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
          <Footer />
        </>
      ) : (
        <SkelatonLoader />
      )}
    </>
  );
};

export default Products;
