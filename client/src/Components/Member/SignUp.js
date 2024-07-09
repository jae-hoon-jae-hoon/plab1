import './Member.css'

import React from 'react'
import SubVisual from '../SubVisual/SubVisual'

// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SignUp = ({title}) => {

    const onClickSubmit = (e) => {
        e.preventDefault();

        console.log("로그인동작");
    }

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
                                <Form.Control type="text" autoComplete="off" placeholder="아이디" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userPassword">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control type="password" autoComplete="off" placeholder="비밀번호" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userPasswordChk">
                                <Form.Label>비밀번호 확인</Form.Label>
                                <Form.Control type="password" autoComplete="off" placeholder="비밀번호 확인" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userName">
                                <Form.Label>이름</Form.Label>
                                <Form.Control type="text" autoComplete="off" placeholder="이름" />
                            </Form.Group>
                            <div className="d-grid pt-5">
                                <Button className="p-3" variant="primary" type="button" onClick={onClickSubmit}>
                                    회원가입
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp