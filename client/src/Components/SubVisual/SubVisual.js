import './SubVisual.css';

import React from 'react'

const SubVisual = ({ pageTitle }) => {
    return (
        <div className='sub-visual'>
            <h1 className='sub-visual__title'>
                {pageTitle}
            </h1>
        </div>
    )
}

export default SubVisual