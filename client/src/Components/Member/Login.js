import './Member.css'

import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { clearUserData } from '../../features/member/memberSlice';

// Components
import SubVisual from '../SubVisual/SubVisual'
import LoginForm from './LoginForm';

// Library
import axios from 'axios'

// reCAPTCHA
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';


const Login = ({ title }) => {
    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });
    const dispatch = useDispatch();

    // navigate
    const navigate = useNavigate();

    // useEffect
    useEffect(() => {
        if (userData) {
            axios.post('/api/member/authorization', userData)
                .then((result) => {
                    if (result.data.success) {
                        navigate('/', { replace: true })
                    }
                    else {
                        dispatch(clearUserData())
                    }
                })
        }
    }, [userData, navigate, dispatch])

    // Render
    return (
        <>
            <SubVisual pageTitle={title} />
            <div className='container login'>
                <div className='inner'>
                    <div className='container__content'>


                        <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_FIRST_KEY}>
                            <LoginForm />
                        </GoogleReCaptchaProvider>



                    </div>
                </div>
            </div>
        </>
    )
}

export default Login