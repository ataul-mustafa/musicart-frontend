import React, { useContext, useEffect } from 'react'
import { globalContext } from './context API/ContextProvider'
import { useNavigate } from 'react-router-dom';

const Auth = ({children}) => {
    const navigate = useNavigate();
    const {isAuthenticated, setIsAuthenticated} = useContext(globalContext);

    useEffect(()=>{
        const token = localStorage.getItem('jwtToken');
        if(token){
            setIsAuthenticated(true);
        }else{
            setIsAuthenticated(false);
            navigate('/sign-in')
        }
    },[])
  return (
    <>
      {children}
    </>
  )
}

export default Auth
