import React from 'react'
import { Link } from 'react-router-dom'
import { useGetPathName } from '../../commonFunc/url';

const Pagination = React.memo(({ currentPage, pgnLastNum, pgnNumbers, setCurrentPage, keyword }) => {
    let pathName = useGetPathName()

    const onClickPgn = (number) => (e) => {
        setCurrentPage(number)
    }

    const setPgnUrl = (keyword, page) => {
        let url = pathName;
        if (keyword && page) {
            url += `?keyword=${keyword}&page=${page}`
        } else if (keyword && !page) {
            url += `?keyword=${keyword}`
        } else if (!keyword && page) {
            url += `?page=${page}`
        }
        return url;
    }

    return (
        <ul className="pagination">
            <li className="page-item">
                {/* <Link to="#" className="page-link" aria-label="Previous" onClick={onClickPgn(1)}><span aria-hidden="true">&laquo;</span></Link> */}
                <Link to={setPgnUrl(keyword, 1)} onClick={onClickPgn(1)} className="page-link" aria-label="FirstPage">
                    <span aria-hidden="true">&laquo;</span>
                </Link>
            </li>

            {
                pgnNumbers.map(number => (
                    <li key={number} className={`page-item ${number == currentPage ? 'active' : ''}`}>
                        {/* <Link to="#" className="page-link" onClick={onClickPgn(number)}>{number}</Link> */}
                        <Link to={setPgnUrl(keyword, number)} onClick={onClickPgn(number)} className="page-link">{number}</Link>
                    </li>
                ))
            }


            <li className="page-item">
                {/* <Link to="#" className="page-link" aria-label="Next" onClick={onClickPgn(pgnLastNum)}><span aria-hidden="true">&raquo;</span></Link> */}
                <Link to={setPgnUrl(keyword, pgnLastNum)} onClick={onClickPgn(pgnLastNum)} className="page-link" aria-label="LastPage">
                    <span aria-hidden="true">&raquo;</span>
                </Link>
            </li>
        </ul>
    )
}
)

export default Pagination