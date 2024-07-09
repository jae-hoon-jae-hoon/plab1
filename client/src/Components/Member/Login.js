import './Member.css'

import React from 'react'
import SubVisual from '../SubVisual/SubVisual'

// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Login = ({title}) => {

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
                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                <Form.Label>아이디</Form.Label>
                                <Form.Control type="email" placeholder="아이디" />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicPassword">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control type="password" placeholder="비밀번호" />
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="아이디 저장" />
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