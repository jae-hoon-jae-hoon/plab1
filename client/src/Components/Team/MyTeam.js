import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux';

// Components
import SubVisual from '../SubVisual/SubVisual'

// Imgs
import no_img from './../../imgs/no_img.jpg'

// Css
import './Team.css'

// Library
import axios from 'axios'


const MyTeam = ({ title }) => {
  // useParams
  const { id } = useParams();
  const teamNo = parseInt(id);

  // Redux
  const userData = useSelector((state) => {
    return state.member.userData
  });

  // Navigate
  const navigate = useNavigate();

  // State
  const [myteam, setMyTeam] = useState(null)

  // State - 기본정보
  const [teamName, setTeamName] = useState('')
  const [teamDesc, setTeamDesc] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(no_img)
  const [originImgKey, setOriginImgKey] = useState('')
  const [chkChangeImg, setChkChangeImg] = useState(false)
  // Ref
  const imgRef = useRef()

  // State - 팀원정보
  const [memberList, setMemberList] = useState([])
  const [showMemberUpdateForm, setShowMemberUpdateForm] = useState(false);
  const [modalMemberData, setModalMemberData] = useState({})
  const [waitingList, setWaitingList] = useState([])
  const [rejectList, setRejectList] = useState([])

  // State - 경기기록
  const [recordList, setRecordList] = useState([])
  const [showRecordUpdateForm, setShowRecordUpdateForm] = useState(false);
  const [modalRecordData, setModalRecordData] = useState({})


  // useEffect - 기본정보
  useEffect(() => {
    if (!userData?.userNo) {
      alert('로그인이 필요한 기능입니다.')
      navigate('/team');
    }
    else {
      let data = {
        userNo: userData?.userNo,
        teamNo
      }
      axios.post('/api/team/getMyTeamInfo', data)
        .then(result => {
          if (result.data.success) {
            setMyTeam(result.data.data)
            setOriginImgKey(result.data.data.teamImgKey)
            setTeamName(result.data.data.teamName)
            setTeamDesc(result.data.data.teamDesc)
            setImgPreview(result.data.data.teamImgPath);

          } else {
            setMyTeam(null)
            alert("MyTeam 불러오는 도중 에러가 발생했습니다.");
          }
        })
        .catch(err => {
          setMyTeam(null)
          alert("MyTeam 불러오는 도중 에러가 발생했습니다.");
        })
    }
  }, [userData?.userNo, teamNo, navigate])

  // useEffect - 팀원정보
  useEffect(() => {
    if (!userData?.userNo) {
      alert('로그인이 필요한 기능입니다.')
      navigate('/team');
    }
    else {
      // 팀원정보
      let data = {
        teamNo
      }
      axios.post('/api/team/getMyTeamMemberList', data)
        .then(result => {
          if (result.data.success) {
            setMemberList(result.data.data)
            return true
          }
          else {
            setMemberList([])
            alert('팀원정보를 불러오는 도중 에러가 발생했습니다.')
            return false
          }
        })
        .catch(err => {
          setMemberList([])
          alert('팀원정보를 불러오는 도중 에러가 발생했습니다.')
          return false
        })

      // 대기리스트
      axios.post('/api/team/getWaitingList', data)
        .then(result => {
          if (result.data.success) {
            setWaitingList(result.data.data)
            return true
          }
          else {
            setWaitingList([])
            alert('가입대기 리스트를 불러오는데 실패했습니다.')
            return false
          }
        })
        .catch(err => {
          setWaitingList([])
          alert('가입대기 리스트를 불러오는데 실패했습니다.')
          return false
        })

      // 거절리스트
      axios.post('/api/team/getRejectList', data)
        .then(result => {
          if (result.data.success) {
            setRejectList(result.data.data)
            return true
          }
          else {
            setRejectList([])
            alert('가입거절 리스트를 불러오는데 실패했습니다.')
            return false
          }
        })
        .catch(err => {
          setRejectList([])
          alert('가입거절 리스트를 불러오는데 실패했습니다.')
          return false
        })
    }
  }, [userData?.userNo, teamNo, navigate])

  // useEffect - 경기기록
  useEffect(() => {
    if (!userData?.userNo) {
      alert('로그인이 필요한 기능입니다.')
      navigate('/team');
    }
    else {
      // 팀원정보
      let data = {
        teamNo
      }
      axios.post('/api/team/getMyTeamRecord', data)
        .then(result => {
          if (result.data.success) {
            setRecordList(result.data.data)
          }
          else {
            throw new Error("경기기록을 불러오는 도중 에러가 발생했습니다.");
          }
        })
        .catch(err => {
          setRecordList([])
          alert('경기기록을 불러오는 도중 에러가 발생했습니다.')
          return false
        })
    }
  }, [userData?.userNo, teamNo, navigate])

  // Method
  const onChangeFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(imgRef.current.files[0])
      setImgPreview(reader.result);
      setChkChangeImg(true)
    };
  }
  const onClickFileDelete = (e) => {
    e.preventDefault();

    let chk = window.confirm('팀 이미지를 삭제하시겠습니까?')
    if (!chk) return false;

    imgRef.current.value = ''
    setImgFile(null)
    setImgPreview(no_img)

    if (originImgKey) {
      setChkChangeImg(true)
    }
  }

  const onClickTeamInfoUpdate = (e) => {
    e.preventDefault();

    // Validation
    if (teamName.trim() === '') {
      alert('팀이름을 입력해주세요.')
      // nameRef.current.focus()
      return false;
    }
    if (teamDesc.trim() === '') {
      alert('팀소개를 입력해주세요.')
      // descRef.current.focus()
      return false;
    }

    const formData = new FormData();
    formData.append('teamNo', teamNo);
    formData.append('img', imgFile);
    formData.append('name', teamName);
    formData.append('desc', teamDesc);
    formData.append('chkChangeImg', chkChangeImg)
    formData.append('originImgKey', originImgKey)

    axios.post('/api/team/updateTeam', formData)
      .then(result => {
        if (result.data.success) {
          // img, name, desc 변경
          let newTeamImgPath = result.data.teamImgPath ? result.data.teamImgPath : no_img
          setImgPreview(newTeamImgPath)
          setTeamName(teamName)
          setTeamDesc(teamDesc)

          alert("정보가 수정되었습니다.")
          return true
        }
        else {
          throw new Error("저장에 실패했습니다.");
        }
      })
      .catch(err => {
        // console.log(err);
        setTeamName(myteam.teamName)
        setTeamDesc(myteam.teamDesc)
        setImgPreview(myteam.teamImgPath)
        alert("저장에 실패했습니다.")
      })
  }

  const onClickShowMemberModal = (item) => () => {
    setModalMemberData(item)
    setShowMemberUpdateForm(true)
  }

  const onClickReleaseMemberList = (item) => (e) => {
    e.preventDefault();

    let chk = window.confirm('정말 방출하시겠습니까?')
    if (!chk) return false;

    let data = {
      teamJoinNo: item.teamJoinNo
    }
    axios.post('/api/team/releaseMemberList', data)
      .then(result => {
        if (result.data.success) {
          setMemberList(prev => {
            let temp = prev.filter(prevItem => prevItem.teamJoinNo !== item.teamJoinNo)
            return temp
          })
          setRejectList(prev => {
            let temp = [...prev, item]
            temp.sort((x, y) => x.teamJoinNo - y.teamJoinNo);
            return temp
          })
          alert('완료되었습니다.')
        } else {
          throw new Error("update fail - waiting list");
        }
      })
      .catch(err => {
        alert('방출 처리 중에 오류가 발생했습니다.')
        return false;
      })
  }

  const onClickApproveWaitingList = (item) => (e) => {
    e.preventDefault();

    let data = {
      teamJoinNo: item.teamJoinNo
    }
    axios.post('/api/team/approveWaitingList', data)
      .then(result => {
        if (result.data.success) {
          setWaitingList(prev => {
            let temp = prev.filter(prevItem => prevItem.teamJoinNo !== item.teamJoinNo)
            return temp
          })
          setMemberList(prev => {
            let temp = [...prev, item]
            temp.sort((x, y) => x.teamJoinNo - y.teamJoinNo);
            return temp
          })
          alert('승인되었습니다.')
        } else {
          throw new Error("update fail - waiting list");
        }
      })
      .catch(err => {
        alert('승인 처리 중에 오류가 발생했습니다.')
        return false;
      })
  }

  const onClickRejectWaitingList = (item) => (e) => {
    e.preventDefault();

    let chk = window.confirm('정말 거절하시겠습니까?')
    if (!chk) return false;

    let data = {
      teamJoinNo: item.teamJoinNo
    }
    axios.post('/api/team/rejectWaitingList', data)
      .then(result => {
        if (result.data.success) {
          setWaitingList(prev => {
            let temp = prev.filter(prevItem => prevItem.teamJoinNo !== item.teamJoinNo)
            return temp
          })
          setRejectList(prev => {
            let temp = [...prev, item]
            temp.sort((x, y) => x.teamJoinNo - y.teamJoinNo);
            return temp
          })
          alert('완료되었습니다.')
        } else {
          throw new Error("update fail - waiting list");
        }
      })
      .catch(err => {
        alert('거절 처리 중에 오류가 발생했습니다.')
        return false;
      })
  }

  const onClickApproveRejectList = (item) => (e) => {
    e.preventDefault();

    let data = {
      teamJoinNo: item.teamJoinNo
    }
    axios.post('/api/team/approveRejectList', data)
      .then(result => {
        if (result.data.success) {
          setRejectList(prev => {
            let temp = prev.filter(prevItem => prevItem.teamJoinNo !== item.teamJoinNo)
            return temp
          })
          setMemberList(prev => {
            let temp = [...prev, item]
            temp.sort((x, y) => x.teamJoinNo - y.teamJoinNo);
            return temp
          })
          alert('승인되었습니다.')
        } else {
          throw new Error("update fail - waiting list");
        }
      })
      .catch(err => {
        alert('승인 처리 중에 오류가 발생했습니다.')
        return false;
      })
  }

  const onClickAddRecord = () => {
    setModalRecordData([])
    setShowRecordUpdateForm(true)
  }

  const onClickShowRecordModal = (item) => () => {
    setModalRecordData(item)
    setShowRecordUpdateForm(true)
  }

  const onClickDeleteRecord = (teamRecordNo) => () => {
    let chk = window.confirm("정말 삭제하시겠습니까?")
    if (!chk) return false;

    let data = {
      teamRecordNo
    }

    axios.post('/api/team/deleteRecord', data)
      .then(result => {
        if (result.data.success) {
          setRecordList(prev => {
            let temp = prev.filter(prevItem => prevItem.teamRecordNo !== teamRecordNo)
            return temp
          })
          alert('삭제되었습니다.')
          return true
        } else {
          throw new Error("삭제 처리 중에 오류가 발생했습니다.");
        }
      })
      .catch(err => {
        alert('삭제 처리 중에 오류가 발생했습니다.')
        return false
      })
  }

  const onClickDeleteTeam = (teamNo, userNo) => () => {

    let chk = window.confirm('팀을 삭제하시겠습니까?')
    if (!chk) return false

    // Validation
    if (!teamNo || !userNo) {
      alert('삭제에 실패했습니다.')
      return false
    }

    let data = {
      teamNo, userNo,
      teamImgKey: originImgKey
    }
    axios.post('/api/team/deleteMyTeam', data)
      .then(result => {
        if (result.data.success) {
          alert('삭제되었습니다.')
          navigate('/team');
        } else {
          throw new Error("삭제 도중 에러가 발생했습니다.");
        }
      })
      .catch(err => {
        alert('삭제 도중 에러가 발생했습니다.')
        return false;
      })
  }

  const getLevelText = (level) => {
    const levelText = {
      1: "마스터",
      2: "관리자",
      3: "일반회원"
    }
    return levelText[level]
  }

  // Render
  return (
    <>
      <SubVisual pageTitle={title} />
      <div className='stadium'>
        <div className='inner'>
          <div className='container__content'>
            {/* <div>
              0. 팀관리 페이지 접속시, level값 검사 <br />
            </div> */}

            {/* 기본 정보 */}
            <div className='team-detail team-info'>
              <h4>기본정보</h4>
              <form>
                <div className='add-form__row'>
                  <div className='label-wrap'>
                    <label htmlFor='teamlogo' className='label-teamlogo'>
                      <img src={imgPreview} alt="" />
                    </label>
                    <label htmlFor='teamlogo' className='btn btn-sm btn-outline-secondary'>
                      이미지 업로드
                    </label>
                    <button className='btn btn-sm btn-outline-danger' onClick={onClickFileDelete}>이미지 삭제</button>
                  </div>
                  <input id="teamlogo" type='file' accept='image/*' className='d-none' ref={imgRef} onChange={onChangeFile} />
                </div>
                <div className='add-form__row'>
                  <input type="text" className='w-100 p-2' placeholder='팀 이름' value={teamName} onChange={(e) => { setTeamName(e.target.value) }} required />
                </div>
                <div className='add-form__row'>
                  <textarea className='w-100 p-2' placeholder='팀 소개' value={teamDesc} onChange={(e) => { setTeamDesc(e.target.value) }} />
                </div>
              </form>
              <div className='text-end'>
                {/* <button className="btn btn-secondary" onClick={onClickReset}>되돌리기</button> */}
                <button className="btn btn-outline-primary" onClick={onClickTeamInfoUpdate}>수정</button>
              </div>
            </div>


            {/* 팀원정보 */}
            <div className='team-detail member-list'>
              <h4>팀원정보</h4>
              <div className='table-wrap'>
                <table className="table text-center">
                  <colgroup>
                    <col width="25%" />
                    <col width="15%" />
                    <col width="10%" />
                    <col width="25%" />
                    <col width="25%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <td>이름</td>
                      <td>등급</td>
                      <td>등번호</td>
                      <td>추가정보</td>
                      <td>관리</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      memberList.length === 0
                        ? <tr><td colSpan={4}>가입된 팀원이 없습니다.</td></tr>
                        : memberList.map(item => {
                          let levelText = getLevelText(item.level)
                          return (
                            <tr key={"memberlist-" + item.teamJoinNo}>
                              <td>{item.userName}</td>
                              <td>{levelText}</td>
                              <td>{item.backnumber === '' ? '-' : item.backnumber}</td>
                              <td>{item.etc}</td>
                              <td>
                                <button className='btn btn-outline-secondary btn-sm' onClick={onClickShowMemberModal(item)}>수정</button>

                                {item.level != 1 &&
                                  <>
                                    &nbsp;
                                    <button className='btn btn-outline-danger btn-sm' onClick={onClickReleaseMemberList(item)}>방출</button>
                                  </>
                                }
                              </td>
                            </tr>
                          )
                        })
                    }
                  </tbody>
                </table>
              </div>

              {/* 팀원정보수정 모달 */}
              <UpdateMemberModal
                modalMemberData={modalMemberData}
                showMemberUpdateForm={showMemberUpdateForm}
                setShowMemberUpdateForm={setShowMemberUpdateForm}
                setMemberList={setMemberList}
              />
            </div>

            {/* 팀원 가입 관리 */}
            <div className='team-detail join-list'>
              <h4>팀원 가입 관리</h4>
              <div className='table-wrap'>
                <table className="table caption-top text-center">
                  <caption>가입 대기 리스트</caption>
                  <colgroup>
                    <col width="auto" />
                    <col width="120px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <td>이름</td>
                      <td>관리</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      waitingList.length === 0
                        ? <tr><td colSpan={2} className='no-result'>가입 대기중인 회원이 없습니다.</td></tr>
                        : waitingList.map(item => {
                          return (
                            <tr key={"waitingList-" + item.teamJoinNo}>
                              <td>{item.userName}</td>
                              <td>
                                <button className='btn btn-outline-secondary btn-sm' onClick={onClickApproveWaitingList(item)}>승인</button>
                                &nbsp;
                                <button className='btn btn-outline-danger btn-sm' onClick={onClickRejectWaitingList(item)}>거절</button>
                              </td>
                            </tr>
                          )
                        })
                    }
                  </tbody>
                </table>
                <table className="table caption-top text-center">
                  <caption>가입 거절 리스트</caption>
                  <colgroup>
                    <col width="auto" />
                    <col width="120px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <td>이름</td>
                      <td>관리</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      rejectList.length === 0
                        ? <tr><td colSpan={2} className='no-result'>가입 거절된 회원이 없습니다.</td></tr>
                        : rejectList.map(item => {
                          return (
                            <tr key={"rejectList-" + item.teamJoinNo}>
                              <td>{item.userName}</td>
                              <td>
                                <button className='btn btn-outline-secondary btn-sm' onClick={onClickApproveRejectList(item)}>승인</button>
                              </td>
                            </tr>
                          )
                        })
                    }
                  </tbody>
                </table>
              </div>
            </div>


            {/* 경기기록 관리 */}
            <div className='team-detail record-list'>
              <h4>경기기록 관리</h4>
              <button className='btn btn-outline-primary btn-sm btn-add' onClick={onClickAddRecord}>추가</button>
              <table className="table text-center">
                <colgroup>
                  <col width="auto" />
                  <col width="120px" />
                </colgroup>
                <thead>
                  <tr>
                    <td>경기정보</td>
                    <td>관리</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    recordList.length === 0
                      ? <tr><td colSpan={2} className='no-result'>입력된 경기기록이 없습니다.</td></tr>
                      : recordList.map(item => {
                        return (
                          <tr key={"recordList-" + item.teamRecordNo}>
                            <td>
                              {teamName} {item.myScore} : {item.opponentScore} {item.opponentName}
                            </td>
                            <td>
                              <button className='btn btn-outline-secondary btn-sm' onClick={onClickShowRecordModal(item)}>수정</button>
                              &nbsp;
                              <button className='btn btn-outline-danger btn-sm' onClick={onClickDeleteRecord(item.teamRecordNo)}>삭제</button>
                            </td>
                          </tr>
                        )
                      })
                  }
                </tbody>
              </table>

              {/* 경기기록수정 모달 */}
              <UpdateRecordModal
                teamNo={teamNo}
                myTeamName={teamName}
                modalRecordData={modalRecordData}
                showRecordUpdateForm={showRecordUpdateForm}
                setShowRecordUpdateForm={setShowRecordUpdateForm}
                setRecordList={setRecordList}
              />
            </div>

            {/* 팀 삭제 */}
            <div className='team-detail record-list'>
              <h4>팀 삭제</h4>
              <p>팀을 삭제하시려면 아래 버튼을 눌러주세요.</p>
              <br />
              <button className='btn btn- btn-danger' onClick={onClickDeleteTeam(teamNo, userData.userNo)}>팀 삭제</button>
            </div>

          </div>
        </div>
      </div >
    </>
  )
}

/* 팀원정보수정 모달 */
function UpdateMemberModal({ modalMemberData, showMemberUpdateForm, setShowMemberUpdateForm, setMemberList }) {
  const [name, setName] = useState('')
  const [backnumber, setBacknumber] = useState('')
  const [etc, setEtc] = useState('')
  const [level, setLevel] = useState('')

  const nameInputRef = useRef(null)


  useEffect(() => {
    setName(modalMemberData?.userName ? modalMemberData.userName : '')
    setBacknumber(modalMemberData?.backnumber ? modalMemberData.backnumber : '')
    setEtc(modalMemberData?.etc ? modalMemberData.etc : '')
    setLevel(modalMemberData?.level ? modalMemberData.level : '')
  }, [modalMemberData])

  const onClickClose = () => {
    setShowMemberUpdateForm(false)
  }

  const onClickSave = () => {
    let data = {
      teamJoinNo: modalMemberData.teamJoinNo,
      backnumber,
      etc,
      level
    }

    axios.post('/api/team/updateMemberInfo', data)
      .then(result => {
        if (result.data.success) {
          alert("저장되었습니다.")
          setShowMemberUpdateForm(false)

          setMemberList(prev =>
            prev.map(item =>
              item.teamJoinNo === modalMemberData.teamJoinNo ?
                { ...item, backnumber, etc, level }
                : item
            )
          );
          return true
        }
        else {
          throw new Error("저장에 실패하였습니다.");

        }
      })
      .catch(err => {
        alert("저장에 실패하였습니다.")
        return false;
      })
  }

  // Render
  return (
    <div className="modal" tabIndex="-1"
      style={{ display: showMemberUpdateForm ? "block" : "none" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">팀원정보수정</h1>
            <button className="btn-close" onClick={onClickClose}></button>
          </div>
          <div className="modal-body">
            <form className='add-form'>
              <div className='add-form__row'>
                <label htmlFor='name'>이름</label>
                <input type="text" ref={nameInputRef} id="name" className='form-control w-100 p-2' placeholder='이름' defaultValue={name ? name : ''} readOnly disabled />
              </div>
              <div className='add-form__row'>
                <label htmlFor='backnumber'>등번호</label>
                <input type="number" id="backnumber" className='form-control w-100 p-2' placeholder='등번호' value={backnumber}
                  onChange={(e) => {
                    if (e.target.value < 1 || e.target.value > 99) { alert('1~99까지의 숫자만 가능합니다.'); return }
                    setBacknumber(e.target.value)
                  }}
                  min={1} max={99} maxLength={2} />
              </div>
              <div className='add-form__row'>
                <label htmlFor='etc'>추가정보</label>
                <input type="text" id="etc" className='form-control w-100 p-2' placeholder='추가정보' value={etc} onChange={(e) => { setEtc(e.target.value) }} maxLength={300} />
              </div>
              <div className='add-form__row'>
                <label htmlFor='level'>권한</label>
                <select id="level" className='form-select' value={level} onChange={(e) => { setLevel(e.target.value); }}>
                  <option value="2">관리자</option>
                  <option value="3">일반회원</option>
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClickClose}>닫기</button>
            <button className="btn btn-primary" onClick={onClickSave}>저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 경기기록수정 모달 */
function UpdateRecordModal({ teamNo, myTeamName, modalRecordData, showRecordUpdateForm, setShowRecordUpdateForm, setRecordList }) {
  const [opponentName, setOpponentName] = useState('')
  const [opponentScore, setOpponentScore] = useState('')
  const [myScore, setMyScore] = useState('')

  useEffect(() => {
    setOpponentName(modalRecordData?.opponentName ? modalRecordData?.opponentName : '')
    setOpponentScore(modalRecordData?.opponentScore ? modalRecordData?.opponentScore : '')
    setMyScore(modalRecordData?.myScore ? modalRecordData?.myScore : '')
  }, [modalRecordData])

  const onClickClose = () => {
    setShowRecordUpdateForm(false)
  }

  const onClickSave = () => {
    if (!opponentName || !opponentScore || !myScore) {
      alert("값을 입력해주세요.")
      return false;
    }

    let data = {
      teamRecordNo: modalRecordData.teamRecordNo,
      teamNo,
      opponentName,
      opponentScore,
      myScore
    }
    axios.post('/api/team/saveTeamRecord', data)
      .then(result => {
        if (result.data.success) {
          if (result.data.data) {
            // insert
            setRecordList(prev => {
              let temp = [result.data.data, ...prev]
              return temp
            })

          } else {
            // update
            setRecordList(prev =>
              prev.map(item =>
                item.teamRecordNo === modalRecordData.teamRecordNo ?
                  { ...item, opponentName, opponentScore, myScore }
                  : item
              )
            );
          }

          setShowRecordUpdateForm(false)
          alert("저장되었습니다.")
          return true

        } else {
          throw new Error("저장에 실패하였습니다.");
        }
      })
      .catch(err => {
        alert("저장에 실패하였습니다.")
        return false
      })
  }

  // Render
  return (
    <div className="modal" tabIndex="-1"
      style={{ display: showRecordUpdateForm ? "block" : "none" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">경기기록관리</h1>
            <button className="btn-close" onClick={onClickClose}></button>
          </div>
          <div className="modal-body">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }} >
              <span>{myTeamName}</span>
              <input type='number' value={myScore} min={0} max={9999} onChange={e => setMyScore(e.target.value)} />
              :
              <input type='number' value={opponentScore} min={0} max={9999} onChange={e => setOpponentScore(e.target.value)} />
              <input type='text' placeholder='상대팀 이름' maxLength={50} value={opponentName} onChange={e => setOpponentName(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClickClose}>닫기</button>
            <button className="btn btn-primary" onClick={onClickSave}>저장</button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default MyTeam