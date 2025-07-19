class HospitalMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.openInfoWindows = new Map();
        this.myLocation = null;
        this.myLocationMarker = null;
        this.userInfoWindow = null;
        this.userInfoWindowOpen = false;
    }

    // 지도 초기화
    init(centerLat, centerLon) {
        const mapContainer = document.getElementById('map');
        const mapOptions = {
            center: new kakao.maps.LatLng(centerLat, centerLon),
            level: 8
        };
        this.map = new kakao.maps.Map(mapContainer, mapOptions);
        this.setupMyLocation();
        this.setupMyLocationButton();
    }

    // 내 위치 설정
    setupMyLocation() {
        if (!navigator.geolocation) {
            console.warn('이 브라우저는 위치 정보를 지원하지 않습니다.');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.myLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                this.createMyLocationMarker();
            },
            (error) => console.warn('내 위치를 가져올 수 없습니다:', error)
        );
    }

    // 내 위치 마커 생성
    createMyLocationMarker() {
        if (!this.myLocation) return;
        
        const position = new kakao.maps.LatLng(this.myLocation.lat, this.myLocation.lon);
        
        if (this.myLocationMarker) {
            this.myLocationMarker.setMap(null);
        }
        
        this.myLocationMarker = new kakao.maps.Marker({
            position: position,
            map: this.map
        });

        this.userInfoWindow = new kakao.maps.InfoWindow({
            content: '<div style="padding:5px; font-size:13px;">내 위치</div>'
        });

        kakao.maps.event.addListener(this.myLocationMarker, 'click', () => {
            if (this.userInfoWindowOpen) {
                this.userInfoWindow.close();
                this.userInfoWindowOpen = false;
            } else {
                this.userInfoWindow.open(this.map, this.myLocationMarker);
                this.userInfoWindowOpen = true;
            }
        });
    }

    // 내 위치 버튼 설정
    setupMyLocationButton() {
        document.getElementById('myLocationBtn').onclick = () => {
            if (this.myLocation) {
                this.map.setCenter(new kakao.maps.LatLng(this.myLocation.lat, this.myLocation.lon));
            } else {
                alert('내 위치 정보를 불러올 수 없습니다.');
            }
        };
    }

    // 모든 마커 제거
    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
        this.openInfoWindows.forEach(infowindow => infowindow.close());
        this.openInfoWindows.clear();
    }

    // 거리 계산 (Haversine 공식)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // 병상 상태에 따른 색상 결정
    getBedStatusColor(percent) {
        if (percent >= 0 && percent <= 40) return 'green';
        if (percent > 40 && percent <= 70) return 'yellow';
        if (percent > 70 && percent <= 95) return 'orange';
        return 'red';
    }

    // InfoWindow 내용 생성
    createInfoWindowContent(hospital, bgColor) {
        let distanceStr = '';
        if (this.myLocation) {
            const dist = this.calculateDistance(
                this.myLocation.lat, this.myLocation.lon,
                parseFloat(hospital.lat), parseFloat(hospital.lon)
            );
            distanceStr = `<p style="font-size: 13px; margin: 5px 0; color:#0077cc;">내 위치에서 거리: ${dist.toFixed(2)} km</p>`;
        }

        return `<div class="info-box ${bgColor}" style="width: 250px;">
            <h4 style="font-size: 15px; margin: 0;">${hospital.name}</h4>
            <p style="font-size: 13px; margin: 5px 0;">종별: ${hospital.center_type}</p>
            <p style="font-size: 13px; margin: 5px 0;">진료과: ${hospital.department}</p>
            <p style="font-size: 13px; margin: 5px 0;">전체 병상: ${hospital.total_beds} / 사용 병상: ${hospital.used_beds}</p>
            <p style="font-size: 13px; margin: 5px 0; font-weight:bold;">잔여 병상: ${hospital.remain_beds}개</p>
            <p style="font-size: 13px; margin: 5px 0;">전문의 당직: ${hospital.specialist_on_duty ? '있음' : '없음'}</p>
            <p style="font-size: 12px; margin: 5px 0; color:#888;">정보 기준: ${hospital.datetime}</p>
            ${distanceStr}
        </div>`;
    }

    // 병원 데이터 표시
    displayHospitals(hospitalData) {
        if (hospitalData.length === 0) return;

        // 지도 중심점 계산
        const latSum = hospitalData.reduce((sum, h) => sum + parseFloat(h.lat), 0);
        const lonSum = hospitalData.reduce((sum, h) => sum + parseFloat(h.lon), 0);
        const centerLat = latSum / hospitalData.length;
        const centerLon = lonSum / hospitalData.length;
        this.map.setCenter(new kakao.maps.LatLng(centerLat, centerLon));

        // 전문의 당직 병원만 필터링하여 마커 생성
        hospitalData
            .filter(hospital => hospital.specialist_on_duty)
            .forEach(hospital => {
                const markerPosition = new kakao.maps.LatLng(hospital.lat, hospital.lon);
                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                    map: this.map
                });
                
                this.markers.push(marker);

                const bgColor = this.getBedStatusColor(hospital.percent);
                const infowindow = new kakao.maps.InfoWindow({
                    content: this.createInfoWindowContent(hospital, bgColor)
                });

                kakao.maps.event.addListener(marker, 'click', () => {
                    this.openInfoWindows.forEach(iw => iw.close());
                    this.openInfoWindows.clear();
                    infowindow.open(this.map, marker);
                    this.openInfoWindows.set(marker, infowindow);
                });
            });
    }

    // 진료과별 검색
    async searchByDepartment(department) {
        try {
            const url = department ? 
                `/get_hospital_data?department=${encodeURIComponent(department)}` : 
                '/get_hospital_data';
            
            const response = await fetch(url);
            const data = await response.json();
            
            this.clearMarkers();
            this.displayHospitals(data);
        } catch (error) {
            console.error('Error fetching hospital data:', error);
        }
    }

    // 초기 데이터 로드
    async loadInitialData(selectedDepartment) {
        try {
            const response = await fetch('/get_hospital_data');
            const data = await response.json();
            const filteredData = selectedDepartment ? 
                data.filter(hospital => hospital.department === selectedDepartment) : 
                data;
            
            this.clearMarkers();
            this.displayHospitals(filteredData);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }
}

// 전역 변수
let hospitalMap;

// 진료과 변경 시 호출되는 함수
function searchByDepartment() {
    const selectedDepartment = document.getElementById('departmentSelector').value;
    hospitalMap.searchByDepartment(selectedDepartment);
}

// 페이지 로드 시 초기화
window.onload = function() {
    const dataContainer = document.getElementById('data-container');
    const centerLat = parseFloat(dataContainer.dataset.centerLat);
    const centerLon = parseFloat(dataContainer.dataset.centerLon);
    const selectedDepartment = dataContainer.dataset.selectedDepartment;
    
    hospitalMap = new HospitalMap();
    hospitalMap.init(centerLat, centerLon);
    hospitalMap.loadInitialData(selectedDepartment);
};
