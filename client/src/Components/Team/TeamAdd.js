import React, { useEffect, useRef, useState } from 'react'

// Imgs
import no_img from './../../imgs/no_img.png'

// Css
import './Team.css'

// Library
import axios from 'axios'

const TeamAdd = ({ showAddForm, setShowAddForm, setTeamList }) => {
    // State
    const [imgFile, setImgFile] = useState(null)
    const [imgPreview, setImgPreview] = useState(no_img)

    // Ref
    const imgRef = useRef()
    const nameRef = useRef()
    const descRef = useRef()

    // Method
    const onClickCloseAddTeam = (e) => {
        e?.preventDefault();

        // 데이터초기화
        setImgFile(null)
        setImgPreview(no_img)
        imgRef.current.value = ''
        nameRef.current.value = ''
        descRef.current.value = ''

        setShowAddForm(false)
    }

    const onChangeFile = () => {
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(imgRef.current.files[0])
            setImgPreview(reader.result);
        };
    }

    const onClickFileDelete = (e) => {
        e.preventDefault();
        imgRef.current.value = ''
        setImgFile(null)
        setImgPreview(no_img)
    }

    const onClickSave = async (e) => {
        e.preventDefault();
        let name = nameRef.current.value
        let desc = descRef.current.value

        // Validation
        if (name.trim() === '') {
            alert('팀이름을 입력해주세요.')
            nameRef.current.focus()
            return false;
        }
        if (desc.trim() === '') {
            alert('팀소개를 입력해주세요.')
            descRef.current.focus()
            return false;
        }

        const formData = new FormData();
        formData.append('img', imgFile);
        formData.append('name', name);
        formData.append('desc', desc);

        axios.post('/api/team/addTeam', formData)
            .then((result) => {
                if (result.data.success) {
                    let newData = {
                        teamNo: result.data.insertId,
                        teamName: name,
                        teamDesc: desc,
                        teamImgPath: result.data.teamImgPath,
                    }

                    setTeamList((prev) => {
                        let temp = [newData, ...prev]
                        return temp;
                    })
                    alert("저장이 완료되었습니다.")
                    onClickCloseAddTeam()

                } else {
                    alert("팀 만들기에 실패했습니다.")
                    return;
                }
            })
    }

    // Render
    return (
        <div className="modal" tabIndex="-1"
            style={{ display: showAddForm ? "block" : "none" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">팀 만들기</h1>
                        <button className="btn-close" onClick={onClickCloseAddTeam}></button>
                    </div>
                    <div className="modal-body">
                        <form className='add-form'>
                            <div className='add-form__row'>
                                <div className='label-wrap'>
                                    <label htmlFor='teamlogo' className='label-teamlogo'>
                                        <img src={imgPreview ? imgPreview : no_img} alt="" />
                                    </label>
                                    <label htmlFor='teamlogo' className='btn btn-sm btn-outline-secondary'>
                                        이미지 업로드
                                    </label>
                                    <button className='btn btn-sm btn-outline-danger' onClick={onClickFileDelete}>이미지 삭제</button>
                                </div>
                                <input id="teamlogo" type='file' accept='image/*' className='d-none' ref={imgRef} onChange={onChangeFile} />
                            </div>
                            <div className='add-form__row'>
                                <input type="text" className='w-100 p-2' placeholder='팀 이름' ref={nameRef} required />
                            </div>
                            <div className='add-form__row'>
                                <textarea className='w-100 p-2' placeholder='팀 소개' ref={descRef}></textarea>
                            </div>

                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-outline-secondary" onClick={onClickCloseAddTeam}>닫기</button>
                        <button className="btn btn-primary" onClick={onClickSave}>저장</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamAdd