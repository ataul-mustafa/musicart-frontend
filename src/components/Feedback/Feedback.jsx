import React, { useContext, useState } from 'react'
import { VscFeedback } from "react-icons/vsc";
import Style from './Feedback.module.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { globalContext } from '../../context API/ContextProvider';
import { toast } from 'react-toastify';
import axios from 'axios';

const Feedback = () => {
    const { setLoading, isAuthenticated } = useContext(globalContext)

    const [formData, setFormData] = useState({
        feedbackType: '',
        description: '',
    })
    const [errors, setErrors] = useState({
        feedbackTypeError: '',
        descriptionError: '',
    })


    //function to validate all form data 
    const validateFormData = () => {
        const err = {
            feedbackTypeError: '',
            descriptionError: '',
        }
        let validated = false;


        if (!formData.feedbackType) {
            err.feedbackTypeError = "Choose a feedback type";
        }

        if (!formData.description) {
            err.descriptionError = "Write the feedback";
        }

        if (!err.feedbackTypeError && !err.descriptionError) {
            validated = true;
            setErrors({
                feedbackTypeError: '',
                descriptionError: '',
            })
        } else {
            setErrors(err)
        }

        return validated;
    }

    //function to handle input element change state
    const onInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (validateFormData()) {
            try {
                const { data } = await axios.post('https://musicart-backend-c8rh.onrender.com/api/feedback/add', formData, {
                    headers: {
                        Authorization: localStorage.getItem('jwtToken')
                    }
                })
                toast.success(data.message)
            } catch (error) {
                toast.error(error.response.data.error);
            }
        }
        setLoading(false)
        setFormData({
            feedbackType: '',
            description: '',
        })
    }

    const handleKeyPress = async (event, close) => {
        if (event.key === 'Enter' && !event.shiftKey && validateFormData()) {
            console.log(formData)
            await handleSubmit(event);
            close();
        }
    };

    return (
        <>
            {isAuthenticated &&
                <Popup
                    trigger={<div className={Style.feedbackIcon}><VscFeedback /></div>}
                    position="top center"
                    arrow={false}
                >
                    {
                        close => (
                            <form className={Style.feedbackForm}>
                                <div>
                                    <label htmlFor="type">Type of feedback</label>
                                    <select name="feedbackType"
                                        onChange={onInputChange} id="type"
                                        className={errors.feedbackTypeError ? Style.redBorder : ''}
                                    >
                                        <option value="" hidden>Choose the feedback</option>
                                        <option value="Bugs">Bugs</option>
                                        <option value="Feedback">Feedback</option>
                                        <option value="Query">Query</option>
                                    </select>
                                    <div className={Style.error}>
                                        {
                                            errors.feedbackTypeError && <p>{errors.feedbackTypeError}</p>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="desc">Feedback</label>
                                    <textarea name="description"
                                        className={errors.descriptionError ? Style.redBorder : ''}
                                        id="desc" onChange={onInputChange}
                                        onKeyPress={(e) => { handleKeyPress(e, close) }}
                                        placeholder='Type your feedback'></textarea>
                                    <div className={Style.error}>
                                        {
                                            errors.descriptionError && <p>{errors.descriptionError}</p>
                                        }
                                    </div>
                                </div>
                            </form>
                        )
                    }

                </Popup>
            }
        </>

    )
}

export default Feedback
