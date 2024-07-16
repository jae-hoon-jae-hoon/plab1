import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { clearUserData } from '../../../features/member/memberSlice';

// Bootstrap
import Button from 'react-bootstrap/Button';

// Axios
import axios from 'axios';

const HeaderRight = () => {
    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });

    // dispatch
    const dispatch = useDispatch();

    // State
    const [isLogin, setIsLogin] = useState(false)

    // useEffect
    useEffect(() => {
        console.log("헤더Right 실행");
        userData ? setIsLogin(true) : setIsLogin(false)
    }, [userData])


    // Method
    /* 로그아웃 */
    const onClickLogout = (e) => {
        e.preventDefault();

        // 1. axios로 로그아웃 코드보내서 백단에서 쿠키 삭제
        axios.get('/api/member/logout')
            .then((result) => {
                if (result.data.success) {
                    // 2. 리덕스 초기화
                    dispatch(clearUserData())
                }
            })
    }

    return (
        <div className='header-right'>
            <div className='header-login'>
                {
                    isLogin ?
                        <>
                            <Button variant="outline-secondary" size="sm" type="button" onClick={onClickLogout}>로그아웃</Button>
                            <Link to="/mypage"><Button variant="outline-secondary" size="sm" type="button">마이페이지</Button></Link>
                        </>
                        :
                        <>
                            <Link to="/login"><Button variant="outline-secondary" size="sm" type="button">로그인</Button></Link>
                            <Link to="/signup"><Button variant="outline-secondary" size="sm" type="button">회원가입</Button></Link>
                        </>
                }
            </div>
        </div>
    )
}

export default HeaderRight