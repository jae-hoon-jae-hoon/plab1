import React, { useEffect, useMemo, useRef, useState } from 'react'

// Css
import './Stadium.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

// Library
import axios from 'axios'

// Kakao Map
import { closeOverlay, kakaoMapLoad, panTo, setOverlay } from './kakaomap'

// Redux
import { useSelector } from 'react-redux';


const StadiumMain = ({ title }) => {

    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });

    // State
    const [myStadium, setMyStadium] = useState([]); // 즐겨찾기(전체)
    const [stadiums, setStadiums] = useState([]); // 전체 구장 리스트 (10개씩)
    const [pagination, setPagination] = useState(null)

    // Ref
    const searchInput = useRef(null)

    // useEffect
    useEffect(() => {
        getMyStadiums()

    }, [userData, setStadiums])

    // Method
    const getMyStadiums = async () => {
        try {
            let data = {
                userNo: userData?.userNo ?? '',
            }
            let result = await axios.post('/api/stadium/getStadium', data)

            if (result.data.success) {

                if (result.data.myStadium) {
                    setMyStadium(result.data.myStadium)

                    // KakaoMap
                    kakaoMapLoad(result.data.myStadium, setStadiums, setPagination)
                }
                else {
                    setMyStadium([])

                    // KakaoMap
                    kakaoMapLoad([], setStadiums, setPagination)
                }

            } else {
                throw new Error()
            }
        } catch (error) {
            // console.log(error);
            alert('즐겨찾기 정보를 불러오는데 실패했습니다.')
            setMyStadium([])
        }
    }

    const onSubmitSearch = (e) => {
        e.preventDefault();

        // let keyword = searchInput?.current?.value;

        // if (keyword && keyword.length < 2) {
        //     alert('검색어를 두 글자 이상 입력하세요.')
        //     return false;
        // }

        // getMyStadiums();

        console.log("검색");
    }
    const onClickPgn = (page) => (e) => {

        // let keyword = searchInput?.current?.value;

        // if (keyword && keyword.length < 2) {
        //     alert('검색어를 두 글자 이상 입력하세요.')
        //     return false;
        // }

        // setCurrentPage(page)
        // getMyStadiums();
        console.log("페이지네이션");
    }

    const onClickSave = (stadiumInfo, userNo) => async (e) => {
        e.preventDefault();

        if (!userNo) {
            alert("로그인 후 사용 가능합니다.")
            return false;
        }

        let data = { stadiumInfo, userNo }
        try {
            let result = await axios.post('/api/stadium/setMyStadium', data)
            if (result.data.success) {
                if (result.data.active) {

                    let selectedData = stadiums.find(item => item.id === stadiumInfo.id);

                    let newData = {
                        myStadiumNo: result.data.insertId,
                        mapId: selectedData.id,
                        place_name: selectedData.place_name,
                        address_name: selectedData?.address_name
                            ? selectedData.address_name
                            : '',
                        road_address_name: selectedData?.road_address_name
                            ? selectedData.road_address_name
                            : '',
                        x: selectedData.x,
                        y: selectedData.y,
                    }

                    setMyStadium((prev) => {
                        let temp = [...prev, newData]
                        temp.sort((a, b) => a.mapId - b.mapId);
                        return temp
                    })
                    e.target.classList.add('act')
                }
                else {
                    setMyStadium((prev) => {
                        let temp = prev.filter(item => item.id !== stadiumInfo.id);
                        return temp
                    })
                    e.target.classList.remove('act')
                }
            }
            else {
                throw new Error('Save Fail')
            }

        } catch (error) {
            // console.log(error);
            alert('저장에 실패했습니다.')
            return false;
        }
    }

    const onClickMyStadiumList = () => {
        console.log('asdsad');
    }

    return (
        <>
            <SubVisual pageTitle={title} />
            <div className='container stadium'>
                <div className='inner'>
                    <div style={{ padding: "50px 0 0" }}>
                        1. 구장검색<hr />
                        2. 구장리스트 (10개씩) + 페이지네이션<hr />
                        3. 회원의 경우, 자주찾는구장 리스트 표시 또는 카카오맵에 미리 마커표시<hr />
                        4. 카카오맵 - 구장위치 마커표시 & 카카오 길찾기 연동 ㅇ<hr />
                    </div>

                    <div className='container__content'>

                        {/* 즐겨찾기 */}
                        <div className='my-stadium'>
                            <div>즐겨찾기</div>
                            <div>
                                {myStadium.length > 0 ?

                                    <ul>
                                        {myStadium.map((item, i) => {
                                            return (
                                                <li key={'mystadium-' + item.id} onClick={onClickMyStadiumList}>{item.place_name}</li>
                                            )
                                        })}
                                    </ul>

                                    :
                                    <p>로그인 후 이용가능한 기능입니다.</p>
                                }

                            </div>
                        </div>

                        {/* 버튼 */}
                        <div style={{ padding: "20px", marginBottom: "60px", border: "1px solid " }}>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => { }}
                            >현재 지도에서 검색</button>

                            &nbsp;&nbsp;

                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => { }}
                            >즐겨찾기 보기</button>
                        </div>


                        {/* 구장 리스트 + 지도 */}
                        <div className='stadium-wrap'>
                            <div className='stadium__left'>
                                {/* <div className='stadium__search'>
                                    <form className='stadium__search-form' onSubmit={onSubmitSearch}>
                                        <input ref={searchInput} className='input' placeholder='구장명을 입력해주세요.' />
                                        <button className='btn btn-outline-secondary'>검색</button>
                                    </form>
                                </div> */}
                                <div className='stadium__list'>
                                    <ul>
                                        {
                                            stadiums.map((item, i) => {
                                                let btnSaveActive = myStadium.find(mystd => mystd.mapId === item.id) ? 'act' : '';

                                                let addressText = item.road_address_name ? item.road_address_name : item.address_name;

                                                return (
                                                    <li
                                                        key={'stadium-' + item.id}
                                                        className='stadium__list-item'
                                                        onClick={() => {
                                                            panTo(item.y, item.x);
                                                            closeOverlay();
                                                            setOverlay(i);
                                                        }}
                                                    >
                                                        <div className="stadium__list-name">
                                                            {item.place_name}
                                                        </div>
                                                        <div className="stadium__list-address">{addressText}</div>
                                                        <button
                                                            className={`stadium__list-btn-save ${btnSaveActive}`}
                                                            onClick={onClickSave(item, userData?.userNo ?? '')}
                                                        >저장</button>
                                                        {/* ✏️ ?. : 옵셔널체이닝 */}
                                                    </li>
                                                )
                                            })
                                        }
                                        {
                                            stadiums.length === 0 &&
                                            <li>검색결과가 없습니다.</li>
                                        }
                                    </ul>

                                    {/* Pgn */}
                                    <div className='pagination-wrap'>
                                        <ul className="pagination pagination-sm">
                                            <li className="page-item" aria-label="FirstPage" onClick={onClickPgn(1)}>
                                                <span className="page-link">&laquo;</span>
                                            </li>

                                            {
                                                // pgnNumbers.map(number => (
                                                //     <li
                                                //         key={"pgn-" + number}
                                                //         className={`page-item ${number == currentPage ? 'active' : ''}`}
                                                //         onClick={onClickPgn(number)}
                                                //     >
                                                //         <span className="page-link">{number}</span>
                                                //     </li>
                                                // ))
                                            }

                                            <li className="page-item" aria-label="LastPage" onClick={
                                                () => { }
                                                //    onClickPgn(pgnLastNum)
                                            }>
                                                <span className="page-link">&raquo;</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className='stadium__right'>
                                <div id="map" className='stadium__map'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StadiumMain