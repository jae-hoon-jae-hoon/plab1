import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Css
import './Board.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

// Library
import axios from 'axios'
import Pagination from '../Pagination/Pagination'

const BoardList = ({ title }) => {

    // State
    const [searchInput, setSearchInput] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [list, setList] = useState([])
    const [totalListCnt, setTotalListCnt] = useState(0);
    const [listStartNum, setListStartNum] = useState(0);
    const [pgnLastNum, setPgnLastNum] = useState(0);
    const [pgnNumbers, setPgnNumbers] = useState([]);

    // useEffect
    useEffect(() => {

        let keyword = searchInput;
        keyword = keyword.trim()

        if (keyword && keyword.length < 2) {
            alert('검색어를 두 글자 이상 입력하세요.')
            return false;
        }

        // getList
        let data = {
            currentPage,
            keyword
        }
        axios.post('/api/board/list', data)
            .then((result) => {
                if (result.data.success) {
                    setList(result.data.listData.list)
                    setListStartNum(result.data.listData.listStartNum)
                    setPgnLastNum(result.data.listData.pgnLastNum)
                    setPgnNumbers(result.data.listData.pgnNumbers)
                    setTotalListCnt(result.data.listData.totalListCnt)
                }
                else {
                    alert("리스트 조회에 실패했습니다.")
                    return
                }
            })
    }, [currentPage])


    // Method
    const onChangeSearchInput = (e) => {
        setSearchInput(e.target.value)
    }

    const onClickSearch = (e) => {
        e.preventDefault();

        let keyword = searchInput;
        keyword = keyword.trim()

        if (keyword && keyword.length < 2) {
            alert('검색어를 두 글자 이상 입력하세요.')
            return false;
        }

        setCurrentPage(1)


        // getList
        let data = {
            currentPage,
            keyword
        }
        axios.post('/api/board/list', data)
            .then(result => {

                if (result.data.success) {
                    setList(result.data.listData.list)
                    setListStartNum(result.data.listData.listStartNum)
                    setPgnLastNum(result.data.listData.pgnLastNum)
                    setPgnNumbers(result.data.listData.pgnNumbers)
                    setTotalListCnt(result.data.listData.totalListCnt)


                }
                else {
                    alert("리스트 조회에 실패했습니다.")
                    return false;
                }
            })
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
                                    <input className="form-control me-2" placeholder="Search" aria-label="Search" value={searchInput} onChange={onChangeSearchInput} />
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
                        <span style={{ fontSize: "13px" }} >총 {totalListCnt} 건</span>
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

                        {/* Pagination */}
                        <div className='pgn-wrap'>
                            <Pagination
                                currentPage={currentPage}
                                pgnNumbers={pgnNumbers}
                                pgnLastNum={pgnLastNum}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}

export default BoardList