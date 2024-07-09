import React from 'react'
import './Header.css';

import HeaderLeft from './Sections.js/HeaderLeft';
import Navbar from './Sections.js/Navbar';
import HeaderRight from './Sections.js/HeaderRight';

const Header = () => {

    return (
        <header className='header'>
            <HeaderLeft />
            <Navbar />
            <HeaderRight />
        </header>
    )
}

export default Header