import './Member.css'

import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from 'react-redux';
import { setUserData } from '../../features/member/memberSlice';

// Library
import axios from 'axios'

// reCAPTCHA
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const LoginForm = () => {
    // Redux
    const dispatch = useDispatch();

    // State
    const [userId, setUserId] = useState(localStorage.getItem('userId') ?? '')
    const [userPw, setUserPw] = useState('')
    const [isSave, setIsSave] = useState(localStorage.getItem('userId') ? true : false)

    // Ref
    const inputId = useRef(null)
    const inputPw = useRef(null)

    // navigate
    const navigate = useNavigate();

    // location
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const url = queryParams.get("url");

    // reCAPTCHA
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Method
    const onChangeId = (e) => { setUserId(e.target.value) }
    const onChangePw = (e) => { setUserPw(e.target.value) }
    const onChangeSave = (e) => { setIsSave(e.target.checked) }

    const onClickSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (userId === '') {
            inputId.current.focus()
            return;
        }
        if (userPw === '') {
            inputPw.current.focus()
            return;
        }

        // reCAPTCHA token 받기
        const reCaptchToken = await executeRecaptcha("login");

        if (!reCaptchToken) {
            console.log('reCAPTCHA error')
            return
        }

        // 아이디 저장 처리
        if (isSave) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }

        // Submit
        try {
            let data = {
                userId,
                userPw,
                reCaptchToken
            }
            const response = await axios.post('/api/member/login', data)
            if (!response.data.success) throw new Error("response fail");

            // redux
            let userData = response.data.userData;
            dispatch(setUserData(userData))

            url ? navigate(url) : navigate('/', { replace: true })

        } catch (error) {
            alert('회원정보가 일치하지 않습니다.')
            return false;
        }
    }

    // Render
    return (
        <Form className='login-form'>
            <Form.Group className="mb-2" controlId="formBasicEmail">
                <Form.Label>아이디</Form.Label>
                <Form.Control type="text" name="user_id" placeholder="아이디" value={userId} onChange={onChangeId} ref={inputId} autoComplete='off' />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>비밀번호</Form.Label>
                <Form.Control type="password" name="user_pw" placeholder="비밀번호" value={userPw} onChange={onChangePw} ref={inputPw} autoComplete='off' />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" name="save_id" label="아이디 저장" checked={isSave} onChange={onChangeSave} />
            </Form.Group>
            <div className="d-grid">
                <Button variant="primary" type="button" onClick={onClickSubmit}>
                    로그인
                </Button>
            </div>
        </Form>
    )
}

export default LoginForm