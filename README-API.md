# 🏮 Lovely Shinookubo - 실시간 API 연동 가이드

> 신오쿠보 코리아타운의 실시간 맛집 정보와 AI 추천을 제공하는 스마트 가이드 (API 완전 연동 버전)

## 🚀 빠른 시작

### 1단계: 프록시 서버 시작 (포트 7077)
```bash
# Node.js가 설치되어 있어야 합니다
./start-server.sh

# 또는 직접 실행
node proxy-server.js
```

### 2단계: 웹 서버 시작 (별도 터미널)
```bash
# Python 3 사용
python3 -m http.server 8000

# 또는 Node.js 사용
npx serve .
```

### 3단계: 브라우저에서 접속
```
http://localhost:8000/index-final.html
```

## 🔑 API 키 설정 완료

다음 API들이 연동되어 있습니다:

### ✅ Google Places API
- **기능**: 실시간 맛집 검색, 평점, 리뷰, 영업시간
- **엔드포인트**: `/api/places/nearbysearch/json`
- **상태**: 활성화됨

### ✅ OpenWeather API  
- **기능**: 실시간 날씨 정보, 날씨 기반 추천
- **엔드포인트**: `/api/weather`
- **상태**: 활성화됨

### ✅ Twitter API
- **기능**: 실시간 소셜미디어 피드, 감정 분석
- **엔드포인트**: `/api/twitter`
- **상태**: 활성화됨

## 🌟 새로운 기능들

### 📍 실시간 Google Places 검색
- 키워드로 신오쿠보 주변 맛집 검색
- 실시간 평점, 리뷰 수, 영업시간 확인
- 지도에서 위치 확인 및 상세 정보

### 🌤️ 날씨 기반 추천
- 실시간 날씨 정보 표시
- 날씨에 따른 맞춤 맛집 추천
- 온도별 메뉴 제안

### 🐦 실시간 소셜미디어 피드
- Twitter에서 실시간 맛집 관련 트윗 수집
- 좋아요, 리트윗 수 표시
- 감정 분석 결과 표시

### 📊 실시간 통계
- 검색된 장소 수
- 현재 영업 중인 곳 수  
- 평균 평점
- 총 리뷰 수

## 🔧 서버 구조

### 프록시 서버 (포트 7077)
```
proxy-server.js
├── Google Places API 프록시
├── OpenWeather API 프록시  
├── Twitter API 프록시
├── CORS 헤더 처리
└── 에러 핸들링
```

### 웹 애플리케이션 (포트 8000)
```
index-final.html
├── 실시간 API 연동
├── 인터랙티브 지도
├── 검색 및 필터링
├── 날씨 위젯
└── 소셜미디어 피드
```

## 📡 API 엔드포인트

### 서버 상태 확인
```bash
curl http://localhost:7077/health
curl http://localhost:7077/api/status
```

### Google Places 검색
```bash
curl "http://localhost:7077/api/places/nearbysearch/json?location=35.7040,139.7052&radius=500&keyword=삼겹살&type=restaurant&language=ko"
```

### 날씨 정보
```bash
curl "http://localhost:7077/api/weather?lat=35.7040&lon=139.7052"
```

### Twitter 검색
```bash
curl "http://localhost:7077/api/twitter?q=신오쿠보&max_results=10"
```

## 🎯 주요 개선사항

### 기존 대비 향상점
1. **실제 API 연동**: 모의 데이터에서 실시간 데이터로 전환
2. **CORS 해결**: 프록시 서버로 브라우저 제한 우회
3. **에러 처리**: API 실패 시 fallback 메커니즘
4. **실시간 업데이트**: 자동 새로고침 및 실시간 데이터
5. **상태 표시**: API 연결 상태 실시간 모니터링

### 성능 최적화
- API 응답 캐싱
- 비동기 데이터 로딩
- 에러 시 graceful degradation
- 자동 재시도 메커니즘

## 🔍 사용법

### 맛집 검색
1. 검색창에 키워드 입력 (예: "삼겹살", "카페", "치킨")
2. "검색" 버튼 클릭 또는 Enter
3. 지도와 리스트에서 결과 확인
4. "지도에서 보기" 버튼으로 위치 확인

### 주변 맛집 탐색
1. "주변 맛집" 버튼 클릭
2. 신오쿠보 반경 500m 내 레스토랑 표시
3. 영업시간, 평점, 리뷰 수 확인

### 실시간 정보 확인
- 우측 상단: 현재 날씨 및 온도
- 좌측 하단: API 연결 상태
- 사이드바: 실시간 트위터 피드
- 하단: 통계 정보

## 🛠️ 기술 스택

### Backend
- **Node.js**: 프록시 서버
- **HTTP/HTTPS**: API 통신

### Frontend  
- **Vanilla JavaScript**: 순수 JS
- **Leaflet.js**: 인터랙티브 지도
- **TailwindCSS**: 스타일링

### APIs
- **Google Places API**: 장소 정보
- **OpenWeather API**: 날씨 데이터
- **Twitter API v2**: 소셜미디어 데이터

## 🐛 트러블슈팅

### 프록시 서버 연결 실패
```bash
# 포트 확인
lsof -i :7077

# 프로세스 종료
kill -9 $(lsof -ti:7077)

# 서버 재시작
./start-server.sh
```

### API 키 오류
1. `api-config.js` 파일의 API 키 확인
2. API 키 유효성 및 할당량 확인
3. 프록시 서버 재시작

### CORS 오류
- 프록시 서버(7077)가 실행 중인지 확인
- 브라우저에서 직접 API 호출하지 말고 프록시 사용

## 📈 성능 모니터링

### 실시간 모니터링
- API 응답 시간
- 에러율 추적
- 사용자 인터랙션 로그

### 최적화 포인트
- API 호출 빈도 조절
- 캐싱 전략 개선
- 지도 렌더링 최적화

## 🚀 향후 계획

### v2.0 로드맵
- [ ] 사용자 인증 및 개인화
- [ ] 리뷰 작성 및 평점 시스템
- [ ] 푸시 알림 서비스
- [ ] 오프라인 지원 강화
- [ ] 다국어 번역 API 연동

### 확장성
- 마이크로서비스 아키텍처 전환
- 데이터베이스 연동
- 클라우드 배포
- CI/CD 파이프라인

## 💬 지원 및 문의

- **이메일**: shin.jeiths@gmail.com
- **개발자**: jeiths (22년차 IT 시스템 엔지니어)
- **전문분야**: Legacy 시스템 DX, API 통합, 실시간 데이터 처리

---

**Made with ❤️ for Real-time Shinookubo Experience**

*실시간 API 통합으로 한 단계 진화한 신오쿠보 스마트 가이드*