import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <ul className='header-navbar'>
            <li><Link to="/board">자유게시판</Link></li>
            <li><Link to="/team">팀 관리</Link></li>
            {/* <li><Link to="">개인 기록</Link></li> */}
            <li><Link to="/stadium">운동장</Link></li>
        </ul>
    )
}

export default Navbar