import React from 'react'
import { Link } from 'react-router-dom'

const HeaderLeft = () => {
  return (
    <div className='header-left'>
      <Link to="/">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#777"><path d="M480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-155.67 31.5-72.66 85.83-127Q251.67-817 324.67-848.5T480-880q83 0 155.67 31.5 72.66 31.5 127 85.83 54.33 54.34 85.83 127Q880-563 880-480q0 82.33-31.5 155.33-31.5 73-85.83 127.34-54.34 54.33-127 85.83Q563-80 480-80Zm203.33-495.33 64-22L764.67-658q-33.34-51.33-81.67-87.83t-108.33-55.5L513.33-760v65.33l170 119.34Zm-406 0 169.34-119.34V-760L386-801.33q-60 19-108.33 55.5Q229.33-709.33 196-658l20 60.67 61.33 22Zm-50 316 55.34-6 36-61.34L258-512l-66-22.67-45.33 36q0 69.67 16.66 127.17 16.67 57.5 64 112.17ZM480-146.67q26.67 0 53.33-4.66Q560-156 588-164l31.33-68-30-51.33h-218l-30 51.33 31.34 68q25.33 8 53 12.67 27.66 4.66 54.33 4.66ZM379.33-350H578l59.33-175.33-157.33-112-158.67 112 58 175.33Zm354 90.67Q780-314 796.67-371.5q16.66-57.5 16.66-127.17L768-530l-65.33 18L642-326.67l35.33 61.34 56 6Z" /></svg>
      </Link>
    </div>
  )
}

export default HeaderLeft