import React, { createContext, useState } from 'react'

export const globalContext = createContext();

const ContextProvider = ({children}) => {

    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);
    const [prodViewMode, setProdViewMode] = useState('grid');
    const [cartData, setCartData] = useState([]);
    const [userData, setUserData] = useState({});
    const [invoiceDetail, setInvoiceDetail] = useState({});
    const [productLoader, setProductLoader] = useState(false);
    const [selectedNav, setSelectedNav] = useState('home');
    const [searchValue, setSearchValue] = useState('')

  return (
    <globalContext.Provider value={{loading, setLoading, searchValue, setSearchValue, selectedNav, setSelectedNav, productLoader, setProductLoader, invoiceDetail, setInvoiceDetail, userData, setUserData, cartData, setCartData, prodViewMode, setProdViewMode, isAuthenticated, setIsAuthenticated, products, setProducts}} >
        {children}
    </globalContext.Provider>
  )
}

export default ContextProvider
