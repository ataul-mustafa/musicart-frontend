import React, { useContext, useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { Link, useNavigate } from 'react-router-dom'
import Style from '../../assets/auth.module.css';
import { globalContext } from '../../context API/ContextProvider';
import { toast } from 'react-toastify';
import axios from 'axios'
import Footer from '../Footer/Footer';

const Signup = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        nameError: '',
        phoneError: '',
        emailError: '',
        passwordError: '',
    })
    const { loading, setLoading, isAuthenticated, setIsAuthenticated } = useContext(globalContext)

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            navigate('/')
        }
    }, [])

    //function to validate all form data
    const validateFormData = () => {
        const err = {
            nameError: '',
            phoneError: '',
            emailError: '',
            passwordError: '',
        }
        let validated = false;

        if (!formData.name) {
            err.nameError = "Name is required!"
        } else if ((formData.name).length < 3) {
            err.nameError = "Name must contain min. 3 characters"
        }

        if (!formData.phone || formData.phone.length !== 10) {
            err.phoneError = "Enter a valid phone no.";
        }

        if (!formData.email) {
            err.emailError = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            err.emailError = "Enter a valid email";
        }

        if (!formData.password) {
            err.passwordError = "Password is required";
        } else if ((formData.password).length < 6) {
            err.passwordError = "Password must contains min. 6 characters"
        }

        if (!err.nameError && !err.phoneError && !err.emailError && !err.passwordError) {
            validated = true;
            setErrors({
                nameError: '',
                phoneError: '',
                emailError: '',
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
                const { data } = await axios.post('https://musicart-backend-c8rh.onrender.com/api/user/sign-up', formData);
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
        <>
            <div className={Style.authContainer}>
                <div className={Style.logo}>
                    <Logo />
                </div>
                <h1>Welcome</h1>
                <form onSubmit={onSubmitFun}>
                    <h1>Create Account <span>Don’t have an account?</span></h1>
                    <div>
                        <label htmlFor="name">Your name</label>
                        <input id='name' type="text"
                            name='name'
                            onChange={onInputChange}
                            className={errors.nameError ? Style.redBorder : ''}
                        />
                    </div>
                    <div className={Style.error}>
                        {
                            errors.nameError && <p>{errors.nameError}</p>
                        }
                    </div>
                    <div>
                        <label htmlFor="mobile">Mobile number</label>
                        <input id='mobile' type="phone"
                            name='phone'
                            onChange={onInputChange}
                            className={errors.phoneError ? Style.redBorder : ''}
                        />
                    </div>
                    <div className={Style.error}>
                        {
                            errors.phoneError && <p>{errors.phoneError}</p>
                        }
                    </div>
                    <div>
                        <label htmlFor="email">Email id</label>
                        <input id='email' type="text"
                            name='email'
                            onChange={onInputChange}
                            className={errors.emailError ? Style.redBorder : ''}
                        />
                    </div>
                    <div className={Style.error}>
                        {
                            errors.emailError && <p>{errors.emailError}</p>
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
                    <h2>By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Musicart. Message and data rates may apply.</h2>
                    <button>Continue</button>
                    <h3>By continuing, you agree to Musicart privacy notice and conditions of use.</h3>
                </form>
                <div className={Style.link}>
                    Already have an account? <Link to={'/sign-in'}> Sign in</Link>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Signup
