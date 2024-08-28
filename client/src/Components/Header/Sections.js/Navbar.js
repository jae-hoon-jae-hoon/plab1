import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ setIsOpenMobileNav }) => {
    const onClickNav = () => {
        if (setIsOpenMobileNav) {
            setIsOpenMobileNav(false)
        }
    }

    return (
        <ul className='header-navbar'>
            <li><Link to="/board" onClick={onClickNav}>자유게시판</Link></li>
            <li><Link to="/team" onClick={onClickNav}>팀관리</Link></li>
            {/* <li><Link to="">개인 기록</Link></li> */}
            <li><Link to="/stadium" onClick={onClickNav}>구장찾기</Link></li>
        </ul>
    )
}

export default Navbar