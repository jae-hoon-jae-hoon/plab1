import React, { useEffect, useState } from 'react'

// Components
import SubVisual from '../SubVisual/SubVisual'

// Imgs
import no_img from './../../imgs/no_img.png'

// Css
import './Team.css'

// Library
import axios from 'axios'


const MyTeam = ({ title }) => {

  // State

  // useEffect
  useEffect(() => {
    //  detail 구하듯이  :id 값 으로 DB조회해서 my_team 데이터 가져오기 
  })

  // Render
  return (
    <>
      <SubVisual pageTitle={title} />
      <div className='container stadium'>
        <div className='inner'>
          <div className='container__content'>

          </div>
        </div>
      </div>
    </>
  )
}

export default MyTeam