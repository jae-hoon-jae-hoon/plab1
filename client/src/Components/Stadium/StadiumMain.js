import React, { useEffect, useState } from 'react'

// Redux
import { useSelector } from 'react-redux';

// Css
import './Stadium.css'

// Components
import SubVisual from '../SubVisual/SubVisual'

// Library
import axios from 'axios'

// Kakao Map
import { closeOverlay, kakaoMapLoad, panTo, setOverlay, showCurrentPosition, showMyStadium } from './kakaomap'
// Slick
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const StadiumMain = ({ title }) => {
    // Redux
    const userData = useSelector((state) => {
        return state.member.userData
    });

    // State
    const [stadiums, setStadiums] = useState([]); // 전체 구장 리스트
    const [myStadium, setMyStadium] = useState([]); // 즐겨찾기 리스트
    const [btnMyStadium, setBtnMyStadium] = useState(false);

    // useEffect
    useEffect(() => {
        getMyStadiums()

    }, [userData])

    // Method
    const getMyStadiums = async () => {
        try {
            let data = {
                userNo: userData?.userNo ?? '',
            }
            let result = await axios.post('/api/stadium/getMyStadium', data)

            if (result.data.success) {

                if (result.data.myStadium) {
                    setMyStadium(result.data.myStadium)
                    kakaoMapLoad(result.data.myStadium, setStadiums)
                }
                else {
                    setMyStadium([])
                    kakaoMapLoad([], setStadiums)
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

    const onClickCardTitle = (index) => (e) => {
        // State
        setStadiums(myStadium)
        setBtnMyStadium(true)

        // KakaoMap
        showMyStadium(myStadium)
        panTo(myStadium[index].y, myStadium[index].x);
        closeOverlay();
        setOverlay(index);
    }

    const onClickCardCopy = (address) => (e) => {
        navigator.clipboard.writeText(address)
        alert('주소가 복사되었습니다.')
    }

    const onClickCurrentSearch = () => {
        showCurrentPosition(myStadium)
        setBtnMyStadium(false)
    }

    const onClickMystadium = (e) => {
        e.preventDefault();
        if (!userData?.userNo) {
            alert("로그인 후 사용 가능합니다.")
            return false;
        }

        if (btnMyStadium) {
            showCurrentPosition(myStadium)
        }
        else {
            setStadiums(myStadium)
            showMyStadium(myStadium)
        }
        setBtnMyStadium(!btnMyStadium)
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
                        id: selectedData.id,
                        mapId: selectedData.id,
                        place_name: selectedData.place_name,
                        address_name: selectedData?.address_name
                            ? selectedData.address_name
                            : '',
                        road_address_name: selectedData?.road_address_name
                            ? selectedData.road_address_name
                            : '',
                        userNo: userNo,
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
                        let temp = prev.filter(item => {
                            return (item.mapId !== stadiumInfo.id)
                        });
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


    // Slick
    // let settings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 3, // 화면에 보이는 컨텐츠 수
    //     slidesToScroll: 1, // 스크롤 시 넘어가는 컨텐츠 수
    //     arrows: true, // 좌,우 버튼
    //     responsive: [ // 반응형 옵션 
    //         {
    //             breakpoint: 992, // (숫자)px 이하일 경우
    //             settings: {
    //                 slidesToShow: 2,
    //                 arrows: true,
    //             }
    //         },
    //         {
    //             breakpoint: 576, // (숫자)px 이하일 경우
    //             settings: {
    //                 slidesToShow: 1,
    //                 arrows: true,
    //             }
    //         }
    //     ]
    // };
    const [settings, setSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // 화면에 보이는 컨텐츠 수
        slidesToScroll: 1, // 스크롤 시 넘어가는 컨텐츠 수
        arrows: true, // 좌,우 버튼
        responsive: [ // 반응형 옵션 
            {
                breakpoint: 992, // (숫자)px 이하일 경우
                settings: {
                    slidesToShow: 2,
                    arrows: true,
                }
            },
            {
                breakpoint: 576, // (숫자)px 이하일 경우
                settings: {
                    slidesToShow: 1,
                    arrows: true,
                }
            }
        ]
    });
    useEffect(() => {
        if (myStadium.length <= 3) {
            setSettings(prevSettings => ({
                ...prevSettings,
                slidesToShow: myStadium.length,
                infinite: false,
            }));
        } else {
            setSettings(prevSettings => ({
                ...prevSettings,
                slidesToShow: 3,
                infinite: true,
            }));
        }
    }, [myStadium]);

    // Render
    return (
        <>
            <SubVisual pageTitle={title} />
            <div className='container stadium'>
                <div className='inner'>
                    <div className='container__content'>

                        {/* 즐겨찾기 */}
                        <div className='my-stadium'>
                            <div className='my-stadium__title'>즐겨찾기</div>
                            <div>
                                {
                                    userData ?
                                        myStadium.length > 0 ?
                                        // ✏️ react-slick
                                            <Slider {...settings}>
                                                {
                                                    myStadium.map((item, i) => {
                                                        return (
                                                            <div
                                                                key={'mystadium-' + item.mapId}
                                                                className='my-stadium__item'
                                                            >
                                                                <div className="card">
                                                                    <div className="card-body">
                                                                        <h5
                                                                            className="card-title mb-2"
                                                                            onClick={onClickCardTitle(i)}
                                                                        >
                                                                            {item.place_name}
                                                                        </h5>
                                                                        <div className="mb-2">
                                                                            <p className="card-text text-truncate">
                                                                                {item.address_name}
                                                                            </p>
                                                                            <p className="road card-text text-truncate">
                                                                                ({item.road_address_name})
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <a href={`https://map.kakao.com/link/to/${item.place_name},${item.y},${item.x}`} target="_blank" className='card-btn-link'>
                                                                                길찾기
                                                                            </a>
                                                                            <button
                                                                                className='card-btn-link copy'
                                                                                onClick={
                                                                                    onClickCardCopy(item?.address_name)
                                                                                }
                                                                            >
                                                                                주소복사
                                                                            </button>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Slider>
                                            :
                                            <p style={{ fontSize: "13px" }}>등록된 장소가 없습니다.</p>
                                        :
                                        <p style={{ fontSize: "13px" }}>로그인 후 이용가능한 기능입니다.</p>
                                }

                            </div>
                        </div>

                        {/* 버튼 */}
                        <div style={{ padding: "20px", border: "1px solid" }}>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={onClickCurrentSearch}
                            >
                                현재 지도에서 검색
                            </button>&nbsp;&nbsp;
                            <button
                                type="button"
                                className={`btn btn-sm ${btnMyStadium ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                onClick={onClickMystadium}
                            >즐겨찾기 보기</button>
                        </div>

                        {/* 구장 리스트 + 지도 */}
                        <div className='stadium-wrap'>
                            <div className='stadium__left'>
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