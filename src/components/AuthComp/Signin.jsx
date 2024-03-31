import React, { useContext, useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { Link, useNavigate } from 'react-router-dom'
import Style from '../../assets/auth.module.css';
import axios from 'axios'
import { globalContext } from '../../context API/ContextProvider';
import { toast } from 'react-toastify';
import Footer from '../Footer/Footer';

const Signin = () => {
    const navigate = useNavigate();
    const {loading, setLoading, isAuthenticated, setIsAuthenticated} = useContext(globalContext)

    const [formData, setFormData] = useState({
        phoneEmail: '', 
        password: '',
    })
    const [errors, setErrors] = useState({
        phoneEmailError: '',
        passwordError: '',
    })

    useEffect(()=>{
        const token = localStorage.getItem('jwtToken');
        if(token){
            navigate('/')
        }
    },[])

    //function to validate all form data 
    const validateFormData = () => {
        const err = {
            phoneEmailError: '',
            passwordError: '',
        }
        let validated = false;


        if (!formData.phoneEmail) {
            err.phoneEmailError = "Enter a valid phone no. or email";
        } else if (!isNaN(formData.phoneEmail) && formData.phoneEmail.length !== 10) {
            err.phoneEmailError = "Invalid phone no";
        } else if (isNaN(formData.phoneEmail) && !/\S+@\S+\.\S+/.test(formData.phoneEmail)) {
            err.phoneEmailError = "Enter a valid email";
        }

        if (!formData.password) {
            err.passwordError = "Password is required";
        } else if ((formData.password).length < 6) {
            err.passwordError = "Password must contains min. 6 characters"
        }

        if (!err.phoneEmailError && !err.passwordError) {
            validated = true;
            setErrors({
                phoneEmailError: '',
                passwordError: '',
            })
        } else {
            setErrors(err)
        }

        return validated;
    }

    //function to handle input element change state
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    //function to submit the signup form if there is no any error
    const onSubmitFun = async (e) => {
        e.preventDefault();

        setLoading(true)
        if (validateFormData()) {
              try {
                const {data} = await axios.post('https://musicart-backend-c8rh.onrender.com/api/user/sign-in', formData);
                localStorage.setItem('jwtToken', data.jwtToken)
                toast.success(data.message);
                navigate('/')
              } catch (error) {
                toast.error(error.response.data.error);
              }
        }
        setLoading(false)
    }

    return (
        <div className={Style.authContainer}>
            <div className={Style.logo}>
                <Logo />
            </div>
            <h1>Welcome</h1>
            <form onSubmit={onSubmitFun}>
                <h1>Sign in <span>Already a customer?</span></h1>
                <div>
                    <label htmlFor="mobileEmail">Enter your email or mobile number</label>
                    <input id='mobileEmail' type="text"
                        name='phoneEmail'
                        onChange={onInputChange}
                        className={errors.phoneEmailError ? Style.redBorder : ''}
                    />
                </div>
                <div className={Style.error}>
                    {
                        errors.phoneEmailError && <p>{errors.phoneEmailError}</p>
                    }
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id='password' type="password"
                        name='password'
                        onChange={onInputChange}
                        className={errors.passwordError ? Style.redBorder : ''}
                    />
                </div>
                <div className={Style.error}>
                    {
                        errors.passwordError && <p>{errors.passwordError}</p>
                    }
                </div>
                <button>Continue</button>
                <h3>By continuing, you agree to Musicart privacy notice and conditions of use.</h3>
            </form>
            <div className={Style.newMessage}>
                New to Musicart?
            </div>
            <Link to={'/sign-up'}>Create your Musicart account</Link>
            <Footer />
        </div>
    )
}

export default Signin
