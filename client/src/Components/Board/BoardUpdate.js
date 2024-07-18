import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

// Css
import './Board.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

// Library
import axios from 'axios';

// Redux
import { useSelector } from 'react-redux'

const BoardUpdate = ({ title }) => {


    // useParams
    const { id } = useParams();

    // State
    const [titleInput, setTitle] = useState('')
    const [content, setContent] = useState('')

    // Navigate
    const navigate = useNavigate();

    // Redux
    const userData = useSelector(state => state.member.userData)

    // useEffect
    useEffect(() => {

        // Authorization
        if (!userData) {
            alert('로그인이 필요한 기능입니다.')
            navigate('/login?url=/board/update/' + id);
        }
        axios.post('/api/member/authorization', userData)
            .then((result) => {
                if (!result.data.success) {
                    // 권한 실패경우 - 로그인페이지 이동 + returnURL은 /board/write로 
                    alert('로그인이 필요한 기능입니다.')
                    navigate('/login?url=/board/update/' + id);
                }
            })

        // Get Board Data
        axios.post('/api/board/detail', { boardNo: id })
            .then(
                result => {
                    if (result.data.success) {
                        let boardData = result.data.data;
                        setTitle(boardData.title)
                        setContent(boardData.content)
                    }
                    else {
                        alert("게시글을 불러오지 못했습니다.")
                        navigate('/board')
                    }
                }
            )
    }, [id, userData])

    // Method
    const onChangeTitle = (e) => { setTitle(e.target.value) }
    const onChangeContent = (e) => { setContent(e.target.value) }
    const onClickSubmit = (e) => {
        e.preventDefault();

        if (titleInput.trim() === '') {
            alert("제목을 입력해주세요.")
            return false;
        }
        if (content.trim() === '') {
            alert("내용을 입력해주세요.")
            return false;
        }

        try {
            let updateData = {
                boardNo: id,
                userNo: userData.userNo,
                title: titleInput,
                content,
            }

            axios.post('/api/board/update', updateData)
                .then((result) => {
                    if (result.data.success) {
                        alert("게시글이 저장되었습니다.")
                        navigate('/board');
                    }
                    else {
                        alert("게시글 작성에 실패했습니다.")
                        return false
                    }
                })

        } catch (error) {
            alert("게시글 작성에 실패했습니다.")
            return false
        }
    }
    const onClickCancel = (e) => {
        e.preventDefault();

        // ⚽ detail페이지로 뒤로가기
        navigate(-1)
    }


    return (
        <>
            <SubVisual pageTitle={title} />

            <div className='container board board-list'>
                <div className='inner'>
                    <div className='container__content'>

                        {/* Form */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="Input1" className="form-label">제목</label>
                                <input type="email" className="form-control" id="Input1" placeholder="제목을 입력해주세요" value={titleInput} onChange={onChangeTitle} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="textarea1" className="form-label">내용</label>
                                <textarea className="form-control" id="textarea1" rows="10" placeholder='내용을 입력해주세요' value={content} onChange={onChangeContent}></textarea>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <button className='btn btn-secondary' onClick={onClickSubmit}>저장</button>
                                &nbsp;
                                <button className='btn btn-outline-secondary' onClick={onClickCancel}>취소</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default BoardUpdate