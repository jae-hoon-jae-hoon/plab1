import React from 'react'
import { Link } from 'react-router-dom'

const Pagination = ({ currentPage, pgnLastNum, pgnNumbers, setCurrentPage }) => {

    const onClickPgn = (number) => (e) => {
        e.preventDefault();
        
        setCurrentPage(number)
    }

    return (
        <ul className="pagination">
            <li className="page-item">
                <Link to="#" className="page-link" aria-label="Previous" onClick={onClickPgn(1)}><span aria-hidden="true">&laquo;</span></Link>
            </li>

            {
                pgnNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage && 'active'}`}>
                        <Link to="#" className="page-link" onClick={onClickPgn(number)}>{number}</Link>
                    </li>
                ))
            }


            <li className="page-item">
                <Link to="#" className="page-link" aria-label="Next" onClick={onClickPgn(pgnLastNum)}><span aria-hidden="true">&raquo;</span></Link>
            </li>
        </ul >
    )
}

export default Pagination