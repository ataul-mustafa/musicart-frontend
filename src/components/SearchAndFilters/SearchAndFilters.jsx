import React, { useContext, useState } from 'react'
import Style from './SearchAndFilter.module.css'
import SearchBar from './SearchBar'
import { IoGridOutline } from "react-icons/io5";
import { IoGrid } from "react-icons/io5";
import { TfiViewListAlt } from "react-icons/tfi";
import { FaThList } from "react-icons/fa";
import { globalContext } from '../../context API/ContextProvider';
import axios from 'axios';
import { toast } from 'react-toastify';

const SearchAndFilters = () => {

  const { setProductLoader, searchValue, setProducts, prodViewMode, setProdViewMode } = useContext(globalContext)

  const filt = {
    headPhoneType: '',
    brand: '',
    color: '',
    price: '',
    sortBy: '',
  }
  const [filters, setFilters] = useState(filt);

  const onFilterChange = async (e, filterName) => {
    const filterValue = e.target.value;

    setFilters({...filters, [filterName]: filterValue})
    filters[filterName] = filterValue;
    setProductLoader(true)
     try {
      const { data } = await axios.get(`https://musicart-backend-c8rh.onrender.com/api/product/filter?name=${searchValue}&headPhoneType=${filters.headPhoneType}&brand=${filters.brand}&color=${filters.color}&price=${filters.price}&sortBy=${filters.sortBy}`, {
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

  return (
    <div className={Style.filterWrapper} >
      <SearchBar />
      <div className={Style.filters}>
        <div>
          <div>
            {
              prodViewMode == 'grid' ?
                <div>
                  <IoGrid />
                  <TfiViewListAlt onClick={() => { setProdViewMode('list') }} />
                </div> :
                <div>
                  <IoGridOutline onClick={() => { setProdViewMode('grid') }} />
                  <FaThList />
                </div>
            }
            <div>
              <select onChange={(e) => { onFilterChange(e, 'headPhoneType') }} >
                <option value="" >Headphone type</option>
                <option value="" disabled>Featured</option>
                <option value="In-ear headphone">In-ear-headphone</option>
                <option value="On-ear headphone">On-ear-headphone</option>
                <option value="Over-ear headphone">Over-ear-headphone</option>
              </select>
              <select onChange={(e) => { onFilterChange(e, 'brand') }}>
                <option value="">Company</option>
                <option value="" disabled>Featured</option>
                <option value="JBL">JBL</option>
                <option value="Sony">Sony</option>
                <option value="Boat">Boat</option>
                <option value="Audio-Technica">Audio-Technica</option>
                <option value="Sennheiser">Sennheiser</option>
                <option value="Beyerdynamic">Beyerdynamic</option>
                <option value="AKG Pro Audio">AKG Pro Audio</option>
              </select>
              <select onChange={(e) => { onFilterChange(e, 'color') }}>
                <option value="">Colour</option>
                <option value="" disabled>Featured</option>
                <option value="Black" >Black</option>
                <option value="White" >White</option>
              </select>
              <select onChange={(e) => { onFilterChange(e, 'price') }}>
                <option value="">Price</option>
                <option value="" disabled>Featured</option>
                <option value="0-1000" >₹0 - ₹1000</option>
                <option value="1000-10000" >₹1000 - ₹10000</option>
                <option value="10000-20000" >₹10000 - ₹20000</option>
              </select>
            </div>
          </div>
          <select onChange={(e) => {onFilterChange(e, 'sortBy') }}>
            <option value="" >Sort By </option>
            <option value="" disabled>Featured</option>
            <option value="priceAscending" >Price : Lowest</option>
            <option value="priceDescending" >Price : Highest</option>
            <option value="nameAscending" >Name : (A-Z)</option>
            <option value="nameDescending" >Name : (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilters
