import React, { useEffect, useMemo, useState } from 'react'

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
    const [stadiums, setStadiums] = useState([]); // 전체 구장 리스트 (10개씩)
    const [myStadium, setMyStadium] = useState([]); // 즐겨찾기(전체)
    const [myStadiumNoArr, setMyStadiumNoArr] = useState([])

    // useEffect
    useEffect(() => {
        const getStadiums = async () => {
            try {
                let result = await axios.post('/api/stadium/getStadium', userData)
                if (result.data.success) {
                    setStadiums(result.data.stadiums)

                    if (result.data.myStadium) {
                        setMyStadium(result.data.myStadium)

                        let stadiumNoTemp = [];
                        result.data.myStadium.map((item) => {
                            stadiumNoTemp.push(item.stadiumNo)
                        })
                        setMyStadiumNoArr(stadiumNoTemp)
                    }
                    else {
                        setMyStadium([])
                        setMyStadiumNoArr([])
                    }

                    kakaoMapLoad(result.data.stadiums, [])
                } else {
                    throw new Error()
                }
            } catch (error) {
                // console.log(error);
                setStadiums([])
            }
        }

        getStadiums()
    }, [userData])

    // Method
    const onSubmitSearch = (e) => {
        e.preventDefault();
        console.log("검색");
    }

    const onClickSave = (stadiumNo, userNo) => async (e) => {
        e.preventDefault();

        if (!userNo) {
            alert("로그인 후 사용 가능합니다.")
            return false;
        }

        let data = { stadiumNo, userNo }
        try {
            let result = await axios.post('/api/stadium/setMyStadium', data)
            if (result.data.success) {
                if (result.data.active) {
                    setMyStadiumNoArr((prev) => {
                        let temp = [...prev, stadiumNo]
                        temp = temp.sort()
                        return temp
                    })
                    e.target.classList.add('act')
                }
                else {
                    setMyStadiumNoArr((prev) => {
                        let temp = prev.filter(no => no !== stadiumNo)
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
                                                <li key={'mystadium-' + item.myStadiumNo} onClick={onClickMyStadiumList}>{item.title}</li>
                                            )
                                        })}
                                    </ul>

                                    :
                                    <p>로그인 후 이용가능한 기능입니다.</p>
                                }

                            </div>
                        </div>

                        {/* 구장 리스트 + 지도 */}
                        <div className='stadium-wrap'>
                            <div className='stadium__left'>
                                <div className='stadium__search'>
                                    <form className='stadium__search-form' onSubmit={onSubmitSearch}>
                                        <input className='input' placeholder='구장명을 입력해주세요.' />
                                        <button className='btn btn-outline-secondary'>검색</button>
                                    </form>
                                </div>
                                <div className='stadium__list'>
                                    <ul>
                                        {
                                            stadiums.map((item, i) => {
                                                let btnSaveActive = myStadiumNoArr.includes(item.stadiumNo) ? 'act' : '';
                                                return (
                                                    <li
                                                        key={'stadium-' + item.stadiumNo}
                                                        // data-no={item.stadiumNo}
                                                        // data-lat={item.latitude}
                                                        // data-lng={item.longitude}
                                                        onClick={() => {
                                                            panTo(item.latitude, item.longitude);
                                                            closeOverlay();
                                                            setOverlay(i);
                                                        }}
                                                    >
                                                        <div className="stadium__list-name">
                                                            {item.title}
                                                        </div>
                                                        <div className="stadium__list-address">{item.address}</div>
                                                        <button className={`stadium__list-btn-save ${btnSaveActive}`} onClick={onClickSave(item.stadiumNo, userData.userNo ?? '')}>저장</button>
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
                                    <div className='pagination' style={{ height: "40px", backgroundColor: "lightgray", opacity: " 0.3" }}>

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