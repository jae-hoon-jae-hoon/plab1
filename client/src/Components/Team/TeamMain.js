import React from 'react'

// Css
import './Team.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

const TeamMain = ({ title }) => {
    return (
        <>
            <SubVisual pageTitle={title} />
            <div className='container board board-list'>
                <div className='inner'>
                    <div className='container__content'>

                        1. 팀검색 & 팀만들기버튼 - 우측정렬
                        <hr />

                        2. My팀
                        <br />
                        - 가입된 팀이 없습니다.
                        <br />
                        또는
                        <br />
                        가입된 팀 정보: 팀원정보 (+ 승무패기록 / 등)
                        <hr />

                        팀리스트 & 클릭 시 팀정보 팝업
                        <hr />


                    </div>
                </div>
            </div>
        </>
    )
}

export default TeamMain