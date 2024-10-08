import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

// Redux
import { useDispatch } from 'react-redux';
import { clearUserData } from '../../../features/member/memberSlice';

// Bootstrap
import Button from 'react-bootstrap/Button';

// Axios
import axios from 'axios';

const HeaderRight = ({ setIsOpenMobileNav, isMobile, userData }) => {


    // dispatch
    const dispatch = useDispatch();

    // useEffect
    useEffect(() => {
        axios.post('/api/member/authorization', userData)
            .then(result => {
                if (!result.data.success) {
                    throw new Error("authorization fail");
                }
            })
            .catch(err => {
                dispatch(clearUserData())
            })
    }, [userData, dispatch])


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
                    alert('로그아웃 되었습니다.')
                }
            })
    }

    const onClickNav = () => {
        if (setIsOpenMobileNav) {
            setIsOpenMobileNav(false)
        }
    }

    return (
        <div className='header-right'>
            {
                userData ?
                    <div className='header-login logined'>
                        {!isMobile &&
                            <span className='header-login__welcome'><b>{userData.userName}</b> 님, 환영합니다</span>
                        }
                        <div className='header-login__btn-wrap'>
                            <Button variant="outline-secondary" size="sm" type="button" onClick={(e) => { onClickLogout(e); onClickNav(); }}>로그아웃</Button>
                            <Link to="/mypage">
                                <Button variant="outline-secondary" size="sm" type="button" onClick={onClickNav}>마이페이지</Button>
                            </Link>
                        </div>
                    </div>
                    :
                    <div className='header-login'>
                        <div className='header-login__btn-wrap'>
                            <Link to="/login"><Button variant="outline-secondary" size="sm" type="button" onClick={onClickNav}>로그인</Button></Link>
                            <Link to="/signup"><Button variant="outline-secondary" size="sm" type="button" onClick={onClickNav}>회원가입</Button></Link>
                        </div>
                    </div>
            }
        </div>
    )
}

export default HeaderRight