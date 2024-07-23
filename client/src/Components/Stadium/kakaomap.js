// Kakao Map
const { kakao } = window;
let map;
let overlays = [];
export const kakaoMapLoad = (stadiumData, myStadium = []) => {
    let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    let options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(37.26733841716354, 126.95903001218987), //지도의 중심좌표.
        // level: 7, //지도의 레벨(확대, 축소 정도),
        // draggable: false, // 지도의 이동, 확대/축소를 막으려면 false
    };

    map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    /* 컨트롤러 */
    let zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    /* 마커 */
    let positionArr = [];
    stadiumData.map((item, i) => {
        let position = {
            title: item.title,
            latlng: new kakao.maps.LatLng(item.latitude, item.longitude),
            latitude: item.latitude,
            longitude: item.longitude,
            address: item.address,
            stadiumNo: item.stadiumNo
        }
        positionArr.push(position)
    })
    let positions = positionArr;

    /* Bounds */
    // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
    let bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < positions.length; i++) {

        /* 마커 */
        let marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        });

        /* 오버레이 */
        let content = document.createElement('div'); content.className = "wrap";
        let info = document.createElement('div'); info.className = "info";
        let title = document.createElement('div'); title.className = "title";
        let close = document.createElement('div'); close.className = "close";
        title.appendChild(document.createTextNode(positions[i].title));
        title.appendChild(close);

        let body = document.createElement('div'); body.className = "body";
        let desc = document.createElement('div'); desc.className = "desc";
        let address = document.createElement('div'); address.className = "address";
        let link = document.createElement('div'); link.className = "link";
        let linkBtn = document.createElement('a'); linkBtn.href = `https://map.kakao.com/link/to/${positions[i].title},${positions[i].latitude},${positions[i].longitude}`; linkBtn.target = "_blank";
        let copyBtn = document.createElement('div'); copyBtn.className = "copy";
        copyBtn.appendChild(document.createTextNode('주소복사'));

        linkBtn.appendChild(document.createTextNode('길찾기'));
        address.appendChild(document.createTextNode(positions[i].address));
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
            console.log(addressText);
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

        overlays.push(overlay)
        kakao.maps.event.addListener(marker, 'click', function () { closeOverlay(); setOverlay(overlay, map) });



        bounds.extend(positions[i].latlng);
    }

    /* 교통정보 */
    // 지도에 교통정보를 표시하도록 지도타입을 추가합니다
    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

    /* 지도 범위 설정 */
    map.setBounds(bounds);
}

// 카카오맵 동작 함수
export const setOverlay = (i) => {
    overlays[i].setMap(map)
}
export const closeOverlay = () => {
    overlays.map((overlay) => {
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