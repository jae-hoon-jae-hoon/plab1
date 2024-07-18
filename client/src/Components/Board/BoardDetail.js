import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

// Css
import './Board.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

// Library
import axios from 'axios';

// Redux
import { useSelector } from 'react-redux'

const BoardDetail = ({ title }) => {

    // useParams
    const { id } = useParams();

    // State
    const [data, setData] = useState([]);

    // navigate
    const navigate = useNavigate();

    // Redux
    const userData = useSelector(state => state.member.userData)

    // useEffect
    useEffect(() => {
        axios.post('/api/board/detail', { boardNo: id })
            .then(
                result => {
                    if (result.data.success) {
                        setData(result.data.data)
                        console.log(result.data.data);
                    }
                    else {
                        alert("게시글을 불러오지 못했습니다.")
                        navigate('/board')
                    }
                }
            )
    }, [id])

    // Method
    const onClickDelete = (e) => {
        e.preventDefault();

        let confirm = window.confirm("삭제하시겠습니까?")
        if (!confirm) return;

        let deleteData = {
            boardNo: id,
            userNo: data.userNo,
        }
        axios.post('/api/board/delete', deleteData)
            .then((result) => {
                console.log(result);
                if (result.data.success) {
                    alert('게시글이 삭제되었습니다.')
                    navigate('/board');
                }
                else {
                    alert("게시글 삭제에 실패하였습니다.")
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

                        {/* Detail */}
                        <div className="container">
                            <div className="row mb-5">
                                <div className="col text-center">
                                    <h2>{data.title}</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    작성자: {data.userName}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    작성일: {data.formatDate}
                                </div>
                            </div>

                            {/* Write Button */}
                            <div className="mt-3 text-end">
                                {
                                    (userData && userData.userNo === data.userNo) &&
                                    <>
                                        <Link to={'/board/update/' + id} className='btn btn-outline-secondary btn-sm'>수정</Link>
                                        &nbsp;
                                        <button className='btn btn-outline-danger btn-sm' onClick={onClickDelete}>삭제</button>
                                    </>
                                }
                            </div>

                            <div className="row mt-3" style={{ padding: "20px 0", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5" }}>
                                <div className="col">
                                    {data.content}
                                </div>
                            </div>
                        </div>

                        <button onClick={() => navigate(-1)}>⚽ 목록으로</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoardDetail