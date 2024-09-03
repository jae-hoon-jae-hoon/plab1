import './Member.css'

import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { clearUserData, setUserData } from '../../features/member/memberSlice';

// Components
import SubVisual from '../SubVisual/SubVisual'

// Library
import axios from 'axios'


// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = ({ title }) => {
    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });
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

        // 아이디 저장 처리
        if (isSave) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }

        // Submit
        try {
            const response = await axios.post('/api/member/login', { userId, userPw })
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
        <>
            <SubVisual pageTitle={title} />

            <div className='container login'>
                <div className='inner'>
                    <div className='container__content'>
                        {/* {<h2 className='container__title'>{title}</h2>} */}

                        <Form className='login-form'>
                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                <Form.Label>아이디</Form.Label>
                                <Form.Control type="email" placeholder="아이디" value={userId} onChange={onChangeId} ref={inputId} autoComplete='off' />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicPassword">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control type="password" placeholder="비밀번호" value={userPw} onChange={onChangePw} ref={inputPw} autoComplete='off' />
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="아이디 저장" checked={isSave} onChange={onChangeSave} />
                            </Form.Group>
                            <div className="d-grid">
                                <Button variant="primary" type="button" onClick={onClickSubmit}>
                                    로그인
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login