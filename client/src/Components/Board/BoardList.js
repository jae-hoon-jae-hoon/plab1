import React from 'react'
import { Link } from 'react-router-dom'

// Css
import './Board.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

const BoardList = ({ title }) => {

    const onClickSearch = (e) => {
        e.preventDefault();

        console.log("검색");
    }

    return (
        <>
            <SubVisual pageTitle={title} />

            <div className='container board board-list'>
                <div className='inner'>
                    <div className='container__content'>
                        {/* Search */}
                        <div className='board__search-wrap'>
                            <div className="container-fluid">
                                <form className="d-inline-flex">
                                    <input className="form-control me-2" placeholder="Search" aria-label="Search" />
                                    <button className="btn btn-secondary" onClick={onClickSearch}>Search</button>
                                </form>
                            </div>
                        </div>

                        {/* Write Button */}
                        <div className='board__write-btn-wrap'>
                            <Link to="/board/write">
                                <button className="btn btn-secondary">글쓰기</button>
                            </Link>
                        </div>


                        {/* List */}
                        <table className="table table-hover text-center">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: "80px" }}>No</th>
                                    <th scope="col" style={{ width: "auto" }}>제목</th>
                                    <th scope="col" style={{ width: "200px" }}>작성자</th>
                                    <th scope="col" style={{ width: "200px" }}>작성일</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>gdgd</td>
                                    <td>asdasdasd</td>
                                    <td>@zzcxcx</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className='pgn-wrap'>
                            <ul className="pagination">
                                <li className="page-item disabled">
                                    <Link to="#" className="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></Link>
                                </li>

                                <li className="page-item active">
                                    <Link to="#" className="page-link">1</Link>
                                </li>
                                <li className="page-item">
                                    <Link to="#" className="page-link">2</Link>
                                </li>
                                <li className="page-item">
                                    <Link to="#" className="page-link">3</Link>
                                </li>
                                <li className="page-item">
                                    <Link to="#" className="page-link">4</Link>
                                </li>
                                <li className="page-item">
                                    <Link to="#" className="page-link">5</Link>
                                </li>

                                <li className="page-item">
                                    <Link to="#" className="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default BoardList