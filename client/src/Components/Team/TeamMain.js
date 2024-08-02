import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Imgs
import myteam_img from './../../imgs/myteam_img.png'
import no_img from './../../imgs/no_img.png'

// Css
import './Team.css'

// Library
import axios from 'axios'

// Components
import SubVisual from '../SubVisual/SubVisual'
import TeamAdd from './TeamAdd'

// customHook
import { useQueryParams } from '../../commonFunc/url'
import Pagination from '../Pagination/Pagination'
import Search from '../Search/Search'

// Redux
import { useSelector } from 'react-redux';


const TeamMain = ({ title }) => {

    const location = useLocation();
    const queryParams = useQueryParams(location);

    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });

    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState('')

    const [teamList, setTeamList] = useState([]);
    // const [totalListCnt, setTotalListCnt] = useState(0);
    // const [listStartNum, setListStartNum] = useState(0);

    const [pgnLastNum, setPgnLastNum] = useState(0);
    const [pgnNumbers, setPgnNumbers] = useState([]);

    const [detail, setDetail] = useState({
        teamNo: '',
        teamName: '',
        teamDesc: '',
        teamImgPath: '',
        player: [],
        record: []
    })

    const [showAddForm, setShowAddForm] = useState(false);
    const [showTeamDetail, setShowTeamDetail] = useState(false)


    // useEffect
    useEffect(() => {
        setCurrentPage(queryParams.get('page') ?? 1)
        setKeyword(queryParams.get('keyword') ?? '')

        // getList
        let data = {
            currentPage,
            keyword,
        }
        axios.post('/api/team/getTeamList', data)
            .then((result) => {
                if (result.data.success) {
                    setTeamList(result.data.listData.list)
                    // setTotalListCnt(result.data.listData.totalListCnt)
                    // setListStartNum(result.data.listData.listStartNum)
                    setPgnLastNum(result.data.listData.pgnLastNum)
                    setPgnNumbers(result.data.listData.pgnNumbers)
                }
                else {
                    alert("리스트 조회에 실패했습니다.")
                    return
                }
            })
    }, [keyword, currentPage, location.search, teamList.length])

    // Method
    const onClickAddTeam = () => {
        setShowAddForm(true)
    }

    const onClickShowDetail = (teamNo) => (e) => {
        e.preventDefault();

        let selected = teamList.filter(item => item.teamNo === teamNo)
        if (selected.length === 0) {
            setDetail({
                teamNo: '',
                teamName: '',
                teamDesc: '',
                teamImgPath: '',
                player: [],
                record: []
            })
            alert("팀 정보를 불러오지 못했습니다.")
            return
        }
        selected = selected[0]

        // 선수정보불러오는 axios
        // 기록불러오는 axios

        setDetail((prev) => {
            let temp = {
                teamNo: teamNo,
                teamName: selected.teamName,
                teamDesc: selected.teamDesc,
                teamImgPath: selected.teamImgPath ? selected.teamImgPath : no_img,

                // player:[],
                // record:[],
            }
            return temp;
        })

        setShowTeamDetail(true)
    }
    const onClickCloseDetail = (e) => {
        e.preventDefault();
        setShowTeamDetail(false)
    }
    const onClickJoinTeam = (teamNo) => async (e) => {
        e.preventDefault();

        // 로그인 검사
        if (!userData?.userNo) {
            alert("로그인 후 사용 가능합니다.")
            return false;
        }

        let data = {
            userNo: userData?.userNo,
            teamNo
        }

        try {
            let joinResult = await axios.post('/api/team/joinTeam', data)
            if (joinResult.data.success) {
                alert("가입신청이 완료되었습니다.")
                return;
            } else {
                throw joinResult.data.message
            }
        } catch (error) {
            if (error === 'status-1') {
                alert('이미 가입된 회원입니다.')
                return;
            } else if (error === 'status-2') {
                alert('가입이 거절된 회원입니다.')
                return;
            }
            else if (error === 'status-3') {
                alert('가입 대기중인 회원입니다.')
                return;
            } else {
                alert('가입신청에 실패했습니다.')
                return false;
            }
        }
    }

    // Render
    return (
        <>
            <SubVisual pageTitle={title} />

            <div className='container board board-list'>
                <div className='inner'>
                    {/* <div className='container__content'>
                        1. My팀
                        <br />
                        - '가입된 팀이 없습니다.' OR 가입된 팀 정보
                        <hr />
                        2. 팀검색 & 팀만들기버튼 - 우측정렬
                        <hr />
                        3. 팀리스트 & 클릭 시 팀정보 팝업
                        <hr />
                    </div> */}


                    <div className='container__content'>
                        {/* My Team */}
                        <div>
                            My Team
                            {/* 팀생성 Button */}
                            <div className='team-list__btn'>
                                <button className='btn btn-secondary'>팀 관리</button>
                            </div>

                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-3 p-2">
                                        <img src={myteam_img} className="img-fluid rounded-start" alt="My team 이미지" style={{ maxWidth: "100%" }} />
                                    </div>
                                    <div className="col-md-9">
                                        <div className="card-body">
                                            <h5 className="card-title">My Team 이름</h5>
                                            <p className="card-text">My Team 소개~ My Team 소개~ My Team 소개~ My Team 소개~ My Team 소개~ My Team 소개~ </p>
                                            <p className="card-text">
                                                <small className="text-muted">추가정보1</small>
                                            </p>
                                            <p className="card-text">
                                                <small className="text-muted">추가정보2</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team List */}
                        <div className='team-list'>
                            Team List

                            {/* 팀검색 Form */}
                            <div className="team-list__search">
                                <Search
                                    keyword={keyword}
                                    setKeyword={setKeyword}
                                    setCurrentPage={setCurrentPage}
                                />
                            </div>

                            {/* 팀생성 Button */}
                            <div className='team-list__btn'>
                                <button className='btn btn-secondary' onClick={onClickAddTeam}>팀 만들기</button>
                            </div>

                            {/* 팀 리스트 */}
                            <ul className='team-list__list'>
                                {teamList.length > 0 ?
                                    teamList.map((item, i) => {
                                        let teamImg = item.teamImgPath ? item.teamImgPath : no_img
                                        return (
                                            <li key={'team-list-' + item.teamNo} className='team-list__item'>
                                                <div className="card">
                                                    <img src={teamImg} alt={item.teamName + "팀 이미지"} className="card-img-top" />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.teamName}</h5>
                                                        <p className="card-text">{item.teamDesc}</p>
                                                        <button className="card-btn btn btn-outline-secondary" onClick={onClickShowDetail(item.teamNo)}>⚽팀정보 보기</button>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                    :
                                    <p>리스트가 존재하지 않습니다.</p>
                                }
                            </ul>

                            {/* 페이지네이션 */}
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

                        {/* 팀 상세페이지 모달 */}
                        <div className="modal detail-modal" tabIndex="-1"
                            style={{ display: showTeamDetail ? "block" : "none" }}
                        >
                            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5">팀정보</h1>
                                        <button className="btn-close" onClick={onClickCloseDetail}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className='img-wrap'>
                                            <img src={detail.teamImgPath} alt={detail.teamName + '이미지'} height="200px" />
                                        </div>
                                        <div className='content-wrap name'>
                                            <h5>{detail.teamName}</h5>
                                        </div>
                                        <div className='content-wrap desc'>
                                            <p>{detail.teamDesc}</p>
                                        </div>

                                        <div className='content-wrap player'>
                                            <div>⚽선수정보</div>
                                            <ul>
                                                <li>7. 손흥민</li>
                                                <li>13. 박지성</li>
                                                <li>19. 이강인</li>
                                            </ul>
                                        </div>
                                        <div className='content-wrap record'>
                                            <div>⚽최근 전적</div>
                                            <ul>
                                                <li>하한마FS 1 : 0 상대팀1</li>
                                                <li>하한마FS 2 : 0 상대팀2</li>
                                                <li>하한마FS 3 : 0 상대팀3</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={onClickCloseDetail}>닫기</button>
                                        <button className="btn btn-primary" onClick={onClickJoinTeam(detail.teamNo)}>⚽가입신청</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 팀 만들기 모달 */}
                        {showAddForm &&
                            <TeamAdd
                                showAddForm={showAddForm}
                                setShowAddForm={setShowAddForm}
                                setTeamList={setTeamList}
                            />
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default TeamMain