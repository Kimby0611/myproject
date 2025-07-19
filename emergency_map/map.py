from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__, static_folder='static')

# 상수 정의
CSV_FILE = 'sample.csv'
ENCODING = 'utf-8'

def load_emergency_data():
    """응급실 데이터를 CSV 파일에서 로드"""
    return pd.read_csv(CSV_FILE, encoding=ENCODING)

def get_location_from_request(emergency_data, selected_location):
    """요청에서 위치 정보를 추출하거나 기본값 반환"""
    if selected_location:
        lat, lon = map(float, selected_location.split(','))
    else:
        first_location = emergency_data.iloc[0]
        lat, lon = first_location['lat'], first_location['lon']
    return lat, lon

@app.route('/')
def index():
    """메인 페이지 라우트"""
    emergency_data = load_emergency_data()
    departments = emergency_data['department'].unique()
    center_types = emergency_data['center_type'].unique()
    
    return render_template('home.html', 
                         departments=departments, 
                         center=center_types)

@app.route('/button_clicked', methods=['POST'])
def button_clicked():
    """지도 페이지로 이동하는 라우트"""
    emergency_data = load_emergency_data()
    
    # 필요한 컬럼만 선택
    location_columns = ['lat', 'lon', 'name', 'remain_beds', 'percent', 
                       'department', 'specialist_on_duty']
    locations = emergency_data[location_columns].values.tolist()
    departments = emergency_data['department'].unique()
    
    # 폼 데이터 가져오기
    selected_location = request.form.get('location')
    selected_department = request.form.get('department')
    selected_center = request.form.get('centerSelector')
    
    # 중심 좌표 설정
    lat, lon = get_location_from_request(emergency_data, selected_location)
    
    return render_template('map.html', 
                         locations=locations,
                         departments=departments,
                         center_lat=lat,
                         center_lon=lon,
                         selected_department=selected_department,
                         selected_center=selected_center)

@app.route('/get_hospital_data')
def get_hospital_data():
    """병원 데이터를 JSON 형태로 반환하는 API"""
    emergency_data = load_emergency_data()
    
    # 필요한 컬럼만 선택
    hospital_columns = ['lat', 'lon', 'name', 'remain_beds', 'center_type', 
                       'percent', 'department', 'specialist_on_duty', 
                       'region', 'total_beds', 'used_beds', 'datetime']
    hospital_data = emergency_data[hospital_columns]
    
    # 부서별 필터링
    selected_department = request.args.get('department')
    if selected_department and selected_department.strip():
        hospital_data = hospital_data[hospital_data['department'] == selected_department]
    
    return hospital_data.to_json(orient='records')


if __name__ == '__main__':
    app.run(debug=True)