import React from 'react'

// Css
import './Stadium.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

const StadiumMain = ({ title }) => {
    return (
        <>
            <SubVisual pageTitle={title} />
            <div className='container board board-list'>
                <div className='inner'>
                    <div className='container__content'>

                        1. 구장검색 - 우측정렬
                        <hr />

                        2. 구장리스트 (5개씩)
                        <hr />

                        3. 회원의 경우, 자주찾는구장 리스트 표시 또는 카카오맵에 미리 마커표시
                        <hr />

                        4. 카카오맵 - 구장위치 마커표시 & 카카오 길찾기 연동
                        <hr />

                    </div>
                </div>
            </div>
        </>
    )
}

export default StadiumMain