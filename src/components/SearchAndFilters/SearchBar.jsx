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
    setProductLoader(false)
  }

  const onSearchChange = async (e) => {

    setProductLoader(true);
    try {
      const {data} = await axios.get(`https://musicart-backend-c8rh.onrender.com/api/product/filter?name=${e.target.value}`, {
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

  return (
    <div className={Style.searchContainer}>
      <input type="text" onChange={onSearchChange} placeholder="Search products..." />
      <FaSearch />
    </div>
  );
}

export default SearchInput;
