import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HeaderRight = () => {

    const [Login, setLogin] = useState(false)

    return (
        <div className='header-right'>
            <div className='header-login'>

                {
                    Login ?
                        <>
                            <button className='btn'>로그아웃</button>
                            <Link to="/mypage" className='btn'>마이페이지</Link>
                        </>
                        :
                        <>
                            <Link to="/login" className='btn'>로그인</Link>
                            <Link to="/signup" className='btn'>회원가입</Link>
                        </>

                }
            </div>
        </div>
    )
}

export default HeaderRight