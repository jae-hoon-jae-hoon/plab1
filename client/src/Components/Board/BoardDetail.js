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
                    }
                    else {
                        alert("게시글을 불러오지 못했습니다.")
                        navigate('/board')
                    }
                }
            )
    }, [id])

    // Method
    const onClickDelete = async (e) => {
        e.preventDefault();

        let confirm = window.confirm("삭제하시겠습니까?")
        if (!confirm) return;

        let deleteData = {
            boardNo: id,
            userNo: data.userNo,
        }

        try {
            let deleteResult = await axios.post('/api/board/delete', deleteData)

            if (deleteResult.data.success) {
                alert('게시글이 삭제되었습니다.')
                navigate('/board');
            }
            else {
                throw new Error();
            }
        } catch (error) {
            alert("게시글 삭제에 실패하였습니다.")
            return false;
        }
    }
    const onClickGoBack = (e) => {
        e.preventDefault();

        // 히스토리 스택을 확인하여 뒤로가기 로직 구현
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/board');
        }
    };

    return (
        <>
            <SubVisual pageTitle={title} />

            <div className='board board-detail'>
                <div className='inner'>
                    <div className='container__content'>

                        {/* Detail */}
                        <div className="container">
                            <div className="row mb-5">
                                <div className="col text-center">
                                    <h2>{data.title}</h2>
                                </div>
                            </div>
                            {/* Write Button */}
                            {
                                (userData && userData.userNo === data.userNo) &&
                                <>
                                    <div className="mt-3 text-end">
                                        <Link to={'/board/update/' + id} className='btn btn-outline-secondary btn-sm'>수정</Link>
                                        &nbsp;
                                        <button className='btn btn-outline-danger btn-sm' onClick={onClickDelete}>삭제</button>
                                    </div>
                                </>
                            }
                            <div className='detail-info'>
                                <span>작성자: {data.userName}</span>
                                <span>작성일: {data.formatDate}</span>
                            </div>
                            <div className="detail-content" style={{ whiteSpace: "pre-line" }}>
                                <div className="col">
                                    {data.content}
                                </div>
                            </div>

                            <button className='btn-go-list btn btn-secondary' onClick={onClickGoBack}>목록으로</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoardDetail