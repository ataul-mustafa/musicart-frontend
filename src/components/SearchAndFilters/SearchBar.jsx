import React, { useContext } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the desired icon component
import Style from './SearchBar.module.css';
import { globalContext } from '../../context API/ContextProvider';
import axios from 'axios';
import { toast } from 'react-toastify';

function SearchInput() {

  const { setProductLoader, setProducts, setSearchValue } = useContext(globalContext)

  const getProducts = async () => {
    setProductLoader(true)
    try {
      const { data } = await axios.get('https://musicart-backend-c8rh.onrender.com/api/product/get-all', {
        headers: {
          authorization: localStorage.getItem('jwtToken')
        }
      });
      setProducts(data);
    } catch (error) {
      toast.error(error.response.data.error)
    }
    // console.log(data)
    setProductLoader(false)
  }

  const onSearchChange = async (e) => {

    setProductLoader(true);
    try {
      const {data} = await axios.get(`http://localhost:5500/api/product/filter?name=${e.target.value}`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
      setProducts(data);
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.error)
    }
    setProductLoader(false)
    setSearchValue(e.target.value)

    // if (e.target.value) {
    //   const prdcts = products.filter(product => ((product.name).split(',')[0]).toLowerCase().startsWith((e.target.value).toLowerCase()))
    //   if (prdcts.length > 0) {
    //     setProducts(prdcts)
    //   }
    // } else {
    //   await getProducts();
    // }

  }

  return (
    <div className={Style.searchContainer}>
      <input type="text" onChange={onSearchChange} placeholder="Search products..." />
      <FaSearch />
    </div>
  );
}

export default SearchInput;
