import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// Bootstrap
import Button from 'react-bootstrap/Button';

const HeaderRight = () => {

    const [Login, setLogin] = useState(false)

    return (
        <div className='header-right'>
            <div className='header-login'>

                {
                    Login ?
                        <>
                            <Button variant="outline-secondary" size="sm" type="button">로그아웃</Button>
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