import React, { useEffect, useLayoutEffect, useState } from 'react'
import './Header.css';

import HeaderLeft from './Sections.js/HeaderLeft';
import Navbar from './Sections.js/Navbar';
import HeaderRight from './Sections.js/HeaderRight';
import { useLocation } from 'react-router-dom';

const Header = () => {
    // Mobile Nav
    const [isMobile, setIsMobile] = useState(false)
    const [isOpenMobileNav, setIsOpenMobileNav] = useState(false)
    useEffect(() => {
        const getWindowWidth = () => {
            if (window.innerWidth > 767) { // 스크롤이 100px 이상일 때
                setIsMobile(false);
                setIsOpenMobileNav(false)
            } else {
                setIsMobile(true);
            }
        };
        getWindowWidth();
        window.addEventListener('resize', getWindowWidth);

        return () => {
            window.removeEventListener('resize', getWindowWidth);
        };
    }, [])

    // useLocation
    const location = useLocation();
    useEffect(() => {
        setIsOpenMobileNav(false)
    }, [location])

    // header floating
    // const [isFloating, setIsFloating] = useState(false)
    // useLayoutEffect(() => {
    //     // const handleScroll = () => {
    //     //     if (window.scrollY > 10) { // 스크롤이 100px 이상일 때
    //     //         setIsFloating(true);
    //     //     } else {
    //     //         setIsFloating(false);
    //     //     }
    //     // };
    //     // window.addEventListener('scroll', handleScroll);

    //     // return () => {
    //     //     window.removeEventListener('scroll', handleScroll);
    //     // };
    // }, [])

    return (
        <header className='header'>
            <div className={isMobile ? 'inner sb' : 'inner'}>
                <HeaderLeft />

                {!isMobile &&
                    <>
                        <Navbar />
                        <HeaderRight />
                    </>
                }

                {isMobile &&
                    <div className='btn-mobile-menu'>
                        <button className='btn btn-outline-secondary' onClick={() => { setIsOpenMobileNav(!isOpenMobileNav) }}>
                            <span className="material-symbols-outlined">
                                menu
                            </span>
                        </button>
                    </div>
                }
            </div>

            {isMobile &&
                <div className={(isOpenMobileNav) ? 'mobile-nav show' : 'mobile-nav'}>
                    <div className='inner'>
                        <div className='mobile-menu'>
                            <Navbar setIsOpenMobileNav={setIsOpenMobileNav} />
                        </div>
                        <div className='mobile-login'>
                            <HeaderRight setIsOpenMobileNav={setIsOpenMobileNav} />
                        </div>
                    </div>
                </div>
            }
        </header>
    )
}

export default Header