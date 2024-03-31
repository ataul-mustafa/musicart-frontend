import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { toast } from 'react-toastify';
import { globalContext } from '../../context API/ContextProvider';
import { RiFileEditFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import Style from './invoice.module.css'
import BackButton from '../MobileComp/BackButton';
import MobileNavBar from '../MobileComp/MobileNavBar';

const Invoice = () => {

    const { setSelectedNav, setInvoiceDetail, setLoading } = useContext(globalContext);
    const [invoiceData, setInvoiceData] = useState([])

    const getInvoiceData = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get('https://musicart-backend-c8rh.onrender.com/api/invoice/get', {
                headers: {
                    Authorization: localStorage.getItem('jwtToken')
                }
            })
            setInvoiceData(data.invoices)
        } catch (error) {
            toast.error(error.response.data.error)
        }
        setLoading(false)
    }

    useEffect(() => {
        setSelectedNav('invoice')
        getInvoiceData()
    }, [])

    return (
        <>
            <Header pathName={'Home/ invoice'} />
            <BackButton path={'/'} text={'Back to Home'} />
            {
                invoiceData.length > 0 ?
                    <div className={Style.invoiceContainer}>
                        <h1><RiFileEditFill className={Style.headIcon} />My Invoices</h1>
                        <div>
                            {
                                invoiceData?.map((invoice, i) => (
                                    <div key={i}>
                                        <div>
                                            <RiFileEditFill className={Style.docIcon} />
                                            <div>
                                                <h2>{invoice.deliveryAddress.name}</h2>
                                                <h3>{invoice.deliveryAddress.address}</h3>
                                            </div>
                                        </div>
                                        <Link onClick={() => { setInvoiceDetail(invoice) }} to={`/invoice-detail`}>View Invoice</Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div> :
                    <h1 className='noProduct'>No invoice found</h1>
            }
            <div className='footer'><Footer /></div>
            <MobileNavBar />
        </>
    )
}

export default Invoice
