import React from 'react'

import './Main.css';
import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <div className='main'>
            <section className='main-sec visual'></section>

            <section className='main-sec board'>
                <div className='inner'>
                    <div className='container__content'>
                        <div className='main-sec__top'>
                            <h2 className='main-sec__title'>
                                <span className="material-symbols-outlined">library_books</span>
                                게시판
                            </h2>
                            <div>
                                <button className='btn btn-secondary'>
                                    <Link to="/board">바로가기</Link>
                                </button>
                            </div>
                        </div>

                        <div className='main-sec__bottom'>
                            <p className='main-sec__desc'>
                                용병모집, 매칭신청 등 자유롭게 게시글을 남길 수 있어요!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='main-sec team'>
                <div className='inner'>
                    <div className='container__content'>
                        <div className='main-sec__top'>
                            <h2 className='main-sec__title'>
                                <span className="material-symbols-outlined">groups</span>
                                팀
                            </h2>
                            <div>
                                <button className='btn btn-secondary'>
                                    <Link to="/team">바로가기</Link>
                                </button>
                            </div>
                        </div>
                        <div className='main-sec__bottom'>
                            <p className='main-sec__desc'>
                                나의 팀을 가입하고, 여러 팀을 만나볼 수 있어요!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='main-sec stadium'>
                <div className='inner'>
                    <div className='container__content'>
                        <div className='main-sec__top'>
                            <h2 className='main-sec__title'>
                                <span className="material-symbols-outlined">map</span>
                                구장
                            </h2>
                            <div>
                                <button className='btn btn-secondary'>
                                    <Link to="/stadium">바로가기</Link>
                                </button>
                            </div>
                        </div>
                        <div className='main-sec__bottom'>
                            <p className='main-sec__desc'>
                                자주 찾는 구장을 등록하고 빠르게 찾아보세요!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Main