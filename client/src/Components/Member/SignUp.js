import './Member.css'

import React, { useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import SubVisual from '../SubVisual/SubVisual'

// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Axios
import axios from 'axios'

const SignUp = ({ title }) => {
    // State
    const [idChk, setIdChk] = useState(false)
    const [idChkText, setIdChkText] = useState('')


    // Ref
    const idInputRef = useRef(null)
    const pwInputRef = useRef(null)
    const pwChkInputRef = useRef(null)
    const nameInputRef = useRef(null)

    // Navigate
    const navigate = useNavigate();

    // Method
    const onChangeId = () => {
        setIdChk(false)
        setIdChkText('중복확인 버튼을 눌러주세요.')
    }

    const onClickIdChk = (e) => {
        e.preventDefault();

        let data = {
            userId: idInputRef.current.value
        }
        axios.post('/api/member/idDuplChk', data)
            .then(result => {
                if (result.data.success) {
                    setIdChk(true)
                    setIdChkText('사용가능한 아이디입니다.')
                } else {
                    setIdChk(false)
                    setIdChkText('이미 사용중인 아이디입니다.')
                }
            })

        idInputRef.current.classList.remove('fail')
        idInputRef.current.classList.add('success')
        setIdChk(true)
    }

    const onClickSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (idInputRef.current.value === '') {
            idInputRef.current.classList.add('fail')
            idInputRef.current.focus();
            alert("ID를 입력하세요.")
            return false;
        }
        if (!idChk) {
            idInputRef.current.classList.add('fail')
            idInputRef.current.focus();
            alert("ID 중복확인이 필요합니다.")
            return false;
        }
        if (pwInputRef.current.value === '') {
            pwInputRef.current.classList.add('fail')
            pwInputRef.current.focus();
            alert("PW를 입력하세요.")
            return false;
        }
        if (pwInputRef.current.value != pwChkInputRef.current.value) {
            pwInputRef.current.classList.add('fail')
            pwChkInputRef.current.classList.add('fail')
            pwInputRef.current.focus();
            alert("비밀번호와 비밀번호확인이 일치하지 않습니다.")
            return false;
        }
        if (nameInputRef.current.value === '') {
            nameInputRef.current.classList.add('fail')
            nameInputRef.current.focus();
            alert("ID를 입력하세요.")
            return false;
        }

        let data = {
            userId: idInputRef.current.value,
            userPw: pwInputRef.current.value,
            userPwChk: pwChkInputRef.current.value,
            userName: nameInputRef.current.value,
        };
        // Submit - axios
        axios.post('/api/member/signup', data)
            .then(result => {
                if (result.data.success) {
                    // redirect 로그인페이지
                    alert("회원가입이 완료되었습니다.")
                    navigate('/login')
                }
                else {
                    alert("회원가입에 실패했습니다.")
                    return false;
                }
            })
    }

    // Render
    return (
        <>
            <SubVisual pageTitle={title} />

            <div className='container login'>
                <div className='inner'>
                    <div className='container__content'>
                        <h2 className='container__title'>{title}</h2>

                        <Form className='login-form'>
                            <Form.Group className="mb-3" controlId="userEmail">
                                <Form.Label>아이디</Form.Label>
                                <div className="d-flex gap-1 pb-1">
                                    <Form.Control type="text" autoComplete="off" placeholder="아이디" ref={idInputRef} onChange={onChangeId} />
                                    <button className="btn btn-outline-secondary flex-shrink-0" type="button" onClick={onClickIdChk}>중복확인</button>
                                </div>
                                {idChkText != '' && <p className={idChk ? 'text-success' : 'text-danger'}>{idChkText}</p>}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userPassword">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control type="password" autoComplete="off" placeholder="비밀번호" ref={pwInputRef} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userPasswordChk">
                                <Form.Label>비밀번호 확인</Form.Label>
                                <Form.Control type="password" autoComplete="off" placeholder="비밀번호 확인" ref={pwChkInputRef} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userName">
                                <Form.Label>이름</Form.Label>
                                <Form.Control type="text" autoComplete="off" placeholder="이름" ref={nameInputRef} />
                            </Form.Group>
                            <div className="d-grid pt-5">
                                <Button className="p-3" variant="primary" type="button" onClick={onClickSubmit}>
                                    회원가입
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div >
        </>
    )
}

export default SignUp