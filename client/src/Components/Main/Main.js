import React from 'react'

// Imgs
import main_img from './../../imgs/main_img.jpg'
// import main_img from './../../imgs/main_img2.jpg'
// import main_img from './../../imgs/main_img3.jpg'

import './Main.css';

const Main = () => {
    return (
        <div className='main'>
            {/* <section className='main-sec' style={{ background: `url(${main_img}) no-repeat center 40px / contain` }}> */}
            <section className='main-sec'>
                <img src={main_img} className='main-img' />
            </section>
        </div>
    )
}

export default Main