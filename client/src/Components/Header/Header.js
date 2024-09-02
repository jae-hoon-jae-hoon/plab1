import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Css
import './Header.css';

// Component
import HeaderLeft from './Sections.js/HeaderLeft';
import Navbar from './Sections.js/Navbar';
import HeaderRight from './Sections.js/HeaderRight';

const Header = () => {

    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });

    // State
    // Mobile Nav
    const [isMobile, setIsMobile] = useState(false)
    const [isOpenMobileNav, setIsOpenMobileNav] = useState(false)

    // useEffect
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

    return (
        <header className='header'>
            <div className={isMobile ? 'inner sb' : 'inner'}>
                <HeaderLeft />

                {!isMobile &&
                    <>
                        <Navbar/>
                        <HeaderRight isMobile={isMobile} userData={userData} />
                    </>
                }

                {isMobile &&
                    <div className='btn-mobile-menu'>
                        {userData &&
                            <span className='header-login__welcome'><b>{userData.userName}</b> 님, 환영합니다</span>
                        }
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
                            <HeaderRight setIsOpenMobileNav={setIsOpenMobileNav} isMobile={isMobile} userData={userData} />
                        </div>
                    </div>
                </div>
            }
        </header>
    )
}

export default Header