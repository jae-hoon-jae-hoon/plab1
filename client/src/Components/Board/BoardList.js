import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Css
import './Board.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

// Library
import axios from 'axios'
import Pagination from '../Pagination/Pagination'
import { useQueryParams } from '../../commonFunc/url'
import Search from '../Search/Search'


const BoardList = ({ title }) => {
    console.log("BoardList");

    const location = useLocation();
    const queryParams = useQueryParams(location);

    // State
    const [keyword, setKeyword] = useState('')
    const [currentPage, setCurrentPage] = useState(1);

    const [list, setList] = useState([])
    const [totalListCnt, setTotalListCnt] = useState(0);
    const [listStartNum, setListStartNum] = useState(0);

    const [pgnLastNum, setPgnLastNum] = useState(0);
    const [pgnNumbers, setPgnNumbers] = useState([]);

    // useEffect
    useEffect(() => {
        setKeyword(queryParams.get('keyword') ?? '')
        setCurrentPage(queryParams.get('page') ?? 1)

        // getList
        let data = {
            keyword,
            currentPage,
        }

        axios.post('/api/board/list', data)
            .then((result) => {
                if (result.data.success) {
                    setList(result.data.listData.list)
                    setTotalListCnt(result.data.listData.totalListCnt)
                    setListStartNum(result.data.listData.listStartNum)
                    setPgnLastNum(result.data.listData.pgnLastNum)
                    setPgnNumbers(result.data.listData.pgnNumbers)
                }
                else {
                    alert("리스트 조회에 실패했습니다.")
                    return
                }
            })
    }, [keyword, currentPage, location.search])

    return (
        <>
            <SubVisual pageTitle={title} />

            <div className='container board board-list'>
                <div className='inner'>
                    <div className='container__content'>
                        {/* Search */}
                        <div className='board__search-wrap'>
                            <Search
                                keyword={keyword}
                                setKeyword={setKeyword}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>

                        {/* Write Button */}
                        <div className='board__write-btn-wrap'>
                            <Link to="/board/write">
                                <button className="btn btn-secondary">글쓰기</button>
                            </Link>
                        </div>

                        {/* List Table */}
                        <BoardListTable
                            totalListCnt={totalListCnt}
                            listStartNum={listStartNum}
                            list={list}
                        />

                        {/* Pagination */}
                        <div className='pgn-wrap'>
                            <Pagination
                                currentPage={currentPage}
                                pgnNumbers={pgnNumbers}
                                pgnLastNum={pgnLastNum}
                                setCurrentPage={setCurrentPage}
                                keyword={keyword}
                            />
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}


const BoardListTable = React.memo(({ totalListCnt, listStartNum, list }) => {
    return (
        <>
            {/* List */}
            < span style={{ fontSize: "13px" }
            } > 총 {totalListCnt} 건</span >
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
                    {
                        list.length > 0 ?
                            list.map((item, i) => {
                                let listNo = listStartNum - i;
                                return (
                                    <tr key={'board-list-' + item.boardNo}>
                                        <th scope="row">{listNo}</th>
                                        <td>
                                            <Link to={`/board/detail/${item.boardNo}`} className='d-block'>
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td>{item.userName}</td>
                                        <td>{item.formatDate}</td>
                                    </tr>
                                )
                            })

                            :
                            <tr>
                                <td colSpan={4}>게시글이 존재하지 않습니다.</td>
                            </tr>
                    }
                </tbody>
            </table>
        </>
    )
}
)

export default BoardList