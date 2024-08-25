import './Member.css'

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import SubVisual from '../SubVisual/SubVisual'
import { useDispatch, useSelector } from 'react-redux';

// Redux
import { setUserData } from '../../features/member/memberSlice';



// Bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Axios
import axios from 'axios'

const Mypage = ({ title }) => {
    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });
    const dispatch = useDispatch();

    // navigate
    const navigate = useNavigate();

    // useState
    const [mypageInfo, setMypageInfo] = useState({
        userNo: 0,
        userId: '',
        userName: ''
    })

    // useEffect
    useEffect(() => {
        // 회원정보검사
        if (!userData) {
            navigate('/')
            return
        }

        // 회원정보 가져오기
        let data = {
            userNo: userData?.userNo
        }
        axios.post('/api/member/getMypageInfo', data)
            .then(result => {
                if (!result.data.success) throw new Error("회원정보를 가져오는데 실패했습니다.");

                let mypageInfo = result.data.data
                setMypageInfo({
                    userNo: mypageInfo.userNo,
                    userId: mypageInfo.userId,
                    userName: mypageInfo.userName
                })
                return;
            })
            .catch(err => {
                alert('회원정보를 가져오는데 실패했습니다.')
                navigate('/')
                return;
            })
    }, [userData])

    // Ref
    const idInputRef = useRef(null)
    const nameInputRef = useRef(null)

    const pwInputRef = useRef(null)
    const newPwInputRef = useRef(null)
    const newPwChkInputRef = useRef(null)

    // Method
    const onClickSubmit = (e) => {
        e.preventDefault();
        let newName = nameInputRef.current.value
        if (newName.trim() === '') {
            alert("이름을 입력해주세요.")
            nameInputRef.current.focus()
            return false;
        }

        let data = {
            userNo: userData.userNo,
            userName: nameInputRef.current.value
        }
        axios.put('/api/member/updateInfo', data)
            .then(result => {
                if (result.data.success) {
                    // redux 수정
                    dispatch(setUserData(data))

                    alert('수정되었습니다.')
                    return true
                }
                else {
                    throw new Error("정보 수정 도중 에러가 발생했습니다.");
                }
            })
            .catch(err => {
                alert('정보 수정 도중 에러가 발생했습니다.');
                return false;
            })
    }

    const onClickChangePw = (e) => {
        e.preventDefault();

        let pw = pwInputRef.current.value
        let newPw = newPwInputRef.current.value
        let newPwChk = newPwChkInputRef.current.value

        if (pw.trim() === '') {
            alert("현재 비밀번호를 입력해주세요.")
            pwInputRef.current.focus()
            return false;
        }
        if (newPw.trim() === '') {
            alert("새로운 비밀번호를 입력해주세요.")
            newPwInputRef.current.focus()
            return false;
        }
        if (newPwChk.trim() === '' || newPw !== newPwChk) {
            alert('새로운 비밀번호 확인이 일치하지 않습니다.')
            newPwChkInputRef.current.focus()
            return false;
        }

        let data = {
            userNo: userData.userNo,
            pw, newPw, newPwChk
        }
        axios.put('/api/member/changePw', data)
            .then(result => {
                if (result.data.success) {
                    pwInputRef.current.value = ''
                    newPwInputRef.current.value = ''
                    newPwChkInputRef.current.value = ''
                    alert('비밀번호를 변경했습니다.')
                    return true
                } else {
                    throw new Error("비밀번호변경 도중 에러가 발생했습니다.");
                }
            })
            .catch(err => {
                if (err.response.data.message === 'pw') {
                    alert("현재 비밀번호가 일치하지 않습니다.")
                    return false
                }
                else {
                    alert("비밀번호변경 도중 에러가 발생했습니다.")
                    return false
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
                        <div style={{ marginBottom: "80px" }}>
                            <h2 className='container__title'>회원정보수정</h2>
                            <Form className='login-form'>
                                <Form.Group className="mb-3" controlId="userEmail">
                                    <Form.Label>아이디</Form.Label>
                                    <Form.Control type="text" autoComplete="off" placeholder="아이디" ref={idInputRef} defaultValue={mypageInfo?.userId ? mypageInfo?.userId : ''} readOnly disabled />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="userName">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control type="text" autoComplete="off" placeholder="이름" ref={nameInputRef} defaultValue={mypageInfo?.userName ? mypageInfo?.userName : ''} />
                                </Form.Group>
                                <div className="d-grid pt-5">
                                    <Button className="p-3" variant="primary" type="button" onClick={onClickSubmit}>정보수정</Button>
                                </div>
                            </Form>
                        </div>
                        <div>
                            <h2 className='container__title'>비밀번호변경</h2>
                            <Form className='login-form'>
                                <Form.Group className="mb-3" controlId="userPassword">
                                    <Form.Label>현재 비밀번호</Form.Label>
                                    <Form.Control type="password" autoComplete="off" placeholder="현재 비밀번호" ref={pwInputRef} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="newPassword">
                                    <Form.Label>새로운 비밀번호</Form.Label>
                                    <Form.Control type="password" autoComplete="off" placeholder="새로운 비밀번호" ref={newPwInputRef} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="newPasswordChk">
                                    <Form.Label>새로운 비밀번호 확인</Form.Label>
                                    <Form.Control type="password" autoComplete="off" placeholder="새로운 비밀번호 확인" ref={newPwChkInputRef} />
                                </Form.Group>
                                <div className="d-grid pt-5">
                                    <Button className="p-3" variant="primary" type="button" onClick={onClickChangePw}>비밀번호변경</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Mypage