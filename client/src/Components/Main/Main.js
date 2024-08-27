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
            <section className='main-sec board'>
                <div className='inner'>
                    <div className='container__content'>
                        게시판 - 최근등록된 게시물 4개
                    </div>
                </div>
            </section>
            <section className='main-sec team'>
                <div className='inner'>
                    <div className='container__content'>
                        팀 - 최근등록된 팀 4개
                    </div>
                </div>
            </section>
            <section className='main-sec stadium'>
                <div className='inner'>
                    <div className='container__content'>
                        구장
                        <br></br>
                        자주찾는구장을 등록하고 빠르게 찾아보세요!
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Main