// Kakao Map
const { kakao } = window;
let map;
let markerArr = []
let overlayArr = [];

let myStadiumData2 = [];

let operateSetStadium;

export const kakaoMapLoad = async (myStadiumData, setStadiums, setPagination) => {
    myStadiumData2 = myStadiumData

    operateSetStadium = setStadiums

    // ⚽ geo.. 으로 받아오기
    const CENTER_LAT_LNG = await getCurrentPosition()
    console.log(CENTER_LAT_LNG);

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




    /* 교통정보 */
    // 지도에 교통정보를 표시하도록 지도타입을 추가합니다
    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

    /* 카카오맵 지도검색 */
    let ps = new kakao.maps.services.Places(map);
    let psOptions = {
        location: CENTER_LAT_LNG, // 해당좌표 기준으로 검색
        radius: 5000, // 위 좌표로부터 거리 필터링 값
        sort: kakao.maps.services.SortBy.DISTANCE, // DISTANCE or ACCURACY(default)
    }
    ps.keywordSearch('풋살장', placesSearchCB, psOptions);
    // placesSearchCB: 키워드 검색 완료 시 호출되는 콜백함수 입니다

}

const getCurrentPosition = async () => {

    return new Promise((res, rej) => {
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다.
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position);
                const lat = position.coords.latitude; // 위도
                const lon = position.coords.longitude; // 경도

                const latlng = new kakao.maps.LatLng(lat, lon);
                res(latlng);
            });
        } else {
            rej(new Error("현재 위치를 불러올 수 없습니다."));
        }
    });
};

function placesSearchCB(data, status, pagination) {



    // console.log(data);
    // console.log(status);
    // console.log(pagination);

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

function setMarker(data, index, isMyStadium) {

    // console.log(data);
    // console.log(isMyStadium);

    /* 마커 */
    let marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        title: data.place_name,
        position: new kakao.maps.LatLng(data.y, data.x),
        // ⚽ isMyStadium 에 따라 이미지 변경
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
        position: marker.getPosition(),
        // map: map, // 선언하면 지도에 바로 띄워짐
    });

    overlayArr.push(overlay)
    kakao.maps.event.addListener(marker, 'click', () => {
        closeOverlay(); setOverlay(index);
        panTo(data.y, data.x)
    });
}

// 카카오맵 동작 함수
export const setOverlay = (i) => {
    overlayArr[i].setMap(map)
}
export const closeOverlay = () => {
    overlayArr.map((overlay) => {
        overlay.setMap(null)
    })
}

export function panTo(lat, lng) {
    // 이동할 위도 경도 위치를 생성합니다 
    let moveLatLon = new kakao.maps.LatLng(lat, lng);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
}