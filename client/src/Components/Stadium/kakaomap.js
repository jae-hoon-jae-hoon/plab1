import star_icon from './../../imgs/star_icon.png'

// Kakao Map
const { kakao } = window;
let map;
let markerArr = []
let overlayArr = [];

let myStadiumData2 = [];

let operateSetStadium;

export const kakaoMapLoad = async (myStadiumData, setStadiums) => {
    myStadiumData2 = myStadiumData
    operateSetStadium = setStadiums

    let getCurrentLatLng;
    // // 현재위치가져오기
    // try {
    //     getCurrentLatLng = await getCurrentPosition()
    // } catch (error) {
    //     // console.log(error);
    //     getCurrentLatLng = false
    // }

    const SUWON = new kakao.maps.LatLng(37.26630029760718, 126.99985343903623)

    const CENTER_LAT_LNG = getCurrentLatLng ? getCurrentLatLng : SUWON;

    //지도를 담을 영역의 DOM 레퍼런스
    let container = document.getElementById('map');

    //지도를 생성할 때 필요한 기본 옵션
    let options = {
        center: CENTER_LAT_LNG, //지도의 중심좌표.
        // level: 7, //지도의 레벨(확대, 축소 정도),
        // draggable: false, // 지도의 이동, 확대/축소를 막으려면 false
    };

    //지도생성 및 지도객체 리턴
    map = new kakao.maps.Map(container, options);

    /* 컨트롤러 */
    let zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


    // /* 교통정보 */
    // // 지도에 교통정보를 표시하도록 지도타입을 추가합니다
    // map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);


    /* 검색 */
    kakaomapSearch(CENTER_LAT_LNG)
}

// // GeoLocation을 이용해서 접속 위치를 얻어옵니다.
// const getCurrentPosition = async () => {
//     return new Promise((res, rej) => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition( // ✏️ navigator.geolocation.getCurrentPosition(성공했을떄함수, 에러났을떄함수)
//                 (position) => {
//                     const lat = position.coords.latitude; // 위도
//                     const lon = position.coords.longitude; // 경도

//                     const latlng = new kakao.maps.LatLng(lat, lon);
//                     res(latlng);
//                 },
//                 (err) => {
//                     // console.log(err);
//                     rej(false);
//                 }
//             );
//         } else {
//             // rej(new Error("현재 위치를 불러올 수 없습니다."));
//             rej(false);
//         }
//     });
// };


/* Func: 카카오맵 지도검색 */
function kakaomapSearch(kakaoLatLng) {
    let ps = new kakao.maps.services.Places(map);
    let psOptions = {
        location: kakaoLatLng, // 해당좌표 기준으로 검색
        radius: 3000, // 위 좌표로부터 거리 필터링 값
        sort: kakao.maps.services.SortBy.DISTANCE, // DISTANCE or ACCURACY(default)
    }
    ps.keywordSearch('풋살장', placesSearchCB, psOptions);
    // placesSearchCB: 키워드 검색 완료 시 호출되는 콜백함수 입니다
}

/* 새로운 중심좌표로 검색 */
export function showCurrentPosition(myStadium) {
    myStadiumData2 = myStadium


    let center = map.getCenter();
    let lat = center.getLat()
    let lng = center.getLng()

    let newCenter = new kakao.maps.LatLng(lat, lng)

    kakaomapSearch(newCenter)
}

/* Func: 카카오맵 지도검색 콜백함수 */
function placesSearchCB(data, status, pagination) {
    closeOverlay()
    resetOverlay()
    removeMarkers()

    if (status === kakao.maps.services.Status.OK) {
        operateSetStadium(data)

        /* Bounds */
        // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
        let bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
            // let isMyStadium = data.id가 myStadiumData2의 mapId 배열에 포함되면? true: false
            let isMyStadium = myStadiumData2.find(item => item.mapId === data[i].id)
            setMarker(data[i], i, !!isMyStadium)
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        /* 지도 범위 설정 */
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
    }
}

/* Func : 즐겨찾기만 출력 */
export function showMyStadium(data) {
    myStadiumData2 = data

    closeOverlay()
    resetOverlay()
    removeMarkers()

    /* Bounds */
    // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
    let bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < data.length; i++) {
        let isMyStadium = myStadiumData2.find(item => item.id === data[i].id)
        setMarker(data[i], i, !!isMyStadium)
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }

    /* 지도 범위 설정 */
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

/* Func : 마커, 오버레이 생성 */
function setMarker(data, index, isMyStadium) {
    let markerImage;

    // ✏️ 카카오맵 아이콘 변경
    if (isMyStadium) {
        let imageSrc = star_icon, // 마커이미지의 주소
            imageSize = new kakao.maps.Size(38, 40), // 마커이미지의 크기
            imageOption = { offset: new kakao.maps.Point(17, 50) }; // 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
    }

    /* 마커 */
    let marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        title: data.place_name,
        position: new kakao.maps.LatLng(data.y, data.x),
        image: markerImage ? markerImage : ''
    });
    markerArr.push(marker)

    /* 오버레이 */
    let content = document.createElement('div'); content.className = "wrap";
    let info = document.createElement('div'); info.className = "info";
    let title = document.createElement('div'); title.className = "title";
    let close = document.createElement('div'); close.className = "close";
    title.appendChild(document.createTextNode(data.place_name));
    title.appendChild(close);

    let body = document.createElement('div'); body.className = "body";
    let desc = document.createElement('div'); desc.className = "desc";
    let address = document.createElement('div'); address.className = "address";
    let link = document.createElement('div'); link.className = "link";
    let linkBtn = document.createElement('a');
    linkBtn.href = `https://map.kakao.com/link/to/${data.place_name},${data.y},${data.x}`;
    linkBtn.target = "_blank";
    let copyBtn = document.createElement('div'); copyBtn.className = "copy";
    copyBtn.appendChild(document.createTextNode('주소복사'));

    linkBtn.appendChild(document.createTextNode('길찾기'));
    let addressText = data.road_address_name ? data.road_address_name : data.address_name;
    address.appendChild(document.createTextNode(addressText));
    link.appendChild(linkBtn);

    desc.appendChild(address)
    desc.appendChild(link)
    desc.appendChild(copyBtn);
    body.appendChild(desc)

    info.appendChild(title)
    info.appendChild(body)

    content.appendChild(info)

    copyBtn.onclick = function () {
        let addressText = address.textContent // ✏️ textContent VS innerHTML
        navigator.clipboard.writeText(addressText)
    }

    close.onclick = function () {
        overlay.setMap(null);
    };

    // 마커에 표시할 커스텀오버레이를 생성합니다 
    let overlay = new kakao.maps.CustomOverlay({
        content: content,
        // position: marker.getPosition(),
        position: new kakao.maps.LatLng(data.y, data.x),
        // map: map, // 선언하면 지도에 바로 띄워짐
    });

    overlayArr.push(overlay)
    kakao.maps.event.addListener(marker, 'click', () => {
        closeOverlay();
        setOverlay(index);
        panTo(data.y, data.x)
    });
}

const removeMarkers = () => {
    markerArr.map(mk => {
        mk.setMap(null);
    })
}

export const setOverlay = (i) => {
    overlayArr[i].setMap(map)
}
export const closeOverlay = () => {
    overlayArr.map((overlay) => {
        overlay.setMap(null)
    })
}
const resetOverlay = () => {
    overlayArr = [];
}

export function panTo(lat, lng) {
    // 이동할 위도 경도 위치를 생성합니다 
    let moveLatLon = new kakao.maps.LatLng(lat, lng);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
}
