# 🏮 Lovely Shinookubo - AI 스마트 가이드

신오쿠보 코리아타운의 실시간 맛집 정보와 AI 추천을 제공하는 모바일 최적화 웹앱입니다.

## 🌟 주요 기능

### 📱 모바일 최적화 UI/UX
- **글래스모피즘 디자인**: 투명하고 세련된 인터페이스
- **다크/라이트 모드**: 토글 방식 테마 전환
- **반응형 디자인**: 모든 디바이스에서 완벽한 사용자 경험
- **터치 최적화**: 모바일 제스처 완벽 지원

### 🌐 다국어 지원
- 한국어 🇰🇷
- 영어 🇺🇸  
- 일본어 🇯🇵
- 중국어 (간체/번체) 🇨🇳
- 태국어 🇹🇭
- 베트남어 🇻🇳

### 🗺️ 인터랙티브 지도 시스템
- **Leaflet.js** 기반 고성능 지도
- 인기순으로 마커 크기 차별화
- 클릭 시 상세 정보 팝업 표시
- 실시간 위치 기반 추천

### 📊 실시간 데이터 분석
- **소셜미디어 통합**: X(Twitter), Facebook 실시간 데이터
- **Google Places API**: 평점 및 리뷰 데이터
- **AI 감정 분석**: 리뷰 텍스트 감정 분석
- **트렌드 스코어링**: 실시간 인기도 계산

### 🎯 AI 추천 시스템
- 개인화된 맛집 추천
- 실시간 트렌드 기반 순위
- 음식 타입별 분석
- 평점 기반 필터링

### 📈 분석 대시보드
- **상단 오버레이**: 음식점 타입별/평점별 실시간 막대그래프
- **사이드 패널**: Top 10 인기 맛집 실시간 랭킹
- **투명 글래스 효과**: 시각적 계층 구조

## 🛠️ 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: 글래스모피즘, Grid, Flexbox
- **JavaScript ES6+**: 모던 자바스크립트
- **Chart.js**: 실시간 데이터 시각화
- **Leaflet.js**: 인터랙티브 지도

### API 통합
- **Twitter API**: 실시간 소셜 미디어 데이터
- **Facebook Graph API**: 소셜 미디어 인사이트
- **Google Places API**: 위치 기반 서비스
- **REST API**: RESTful 서비스 아키텍처

### 설계 원칙
- **Mobile-First**: 모바일 우선 반응형 설계
- **Progressive Web App**: PWA 표준 준수
- **Accessibility**: 웹 접근성 고려
- **Performance**: 성능 최적화

## 🚀 빠른 시작

1. **파일 다운로드**
   ```bash
   git clone https://github.com/jeiths2202/lovely-shinookubo.git
   cd lovely-shinookubo
   ```

2. **로컬 서버 실행**
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx serve .

   # PHP
   php -S localhost:8000
   ```

3. **브라우저에서 접속**
   ```
   http://localhost:8000
   ```

## 📱 모바일 설치

iOS Safari 또는 Android Chrome에서:
1. 웹사이트 접속
2. 브라우저 메뉴 → "홈 화면에 추가"
3. 네이티브 앱처럼 사용 가능

## 🎨 디자인 특징

### 글래스모피즘 (Glassmorphism)
- 반투명 배경 (`backdrop-filter: blur()`)
- 미묘한 테두리 및 그라데이션
- 계층적 시각 구조
- 현대적이고 세련된 느낌

### 컬러 팔레트
- **Primary**: `#ff6b6b` (코럴 레드)
- **Secondary**: `#4ecdc4` (터쿼이즈)
- **Accent**: `#45b7d1` (스카이 블루)
- **Dark**: `#2c3e50` (다크 그레이)
- **Light**: `#ecf0f1` (라이트 그레이)

## 📊 데이터 소스

### 실시간 데이터
- **X (Twitter)**: 멘션, 해시태그, 감정 분석
- **Facebook**: 체크인, 리뷰, 공유 수
- **Google Places**: 평점, 리뷰, 사진
- **Instagram**: 위치 태그, 해시태그

### 분석 알고리즘
```javascript
// 인기도 스코어 계산
popularityScore = (
    (twitterMentions * 0.3) +
    (facebookShares * 0.2) +
    (googleRating * 0.4) +
    (instagramTags * 0.1)
) * trendingMultiplier
```

## 🌍 다문화 지원

### 현지화 (i18n)
- 동적 언어 전환
- 문화적 맥락 고려
- 현지 시간대 지원
- 통화 단위 자동 변환

### 접근성 (a11y)
- ARIA 레이블 지원
- 키보드 네비게이션
- 고대비 모드
- 스크린 리더 최적화

## 🔧 고급 기능

### Progressive Web App (PWA)
- 오프라인 캐싱
- 푸시 알림
- 백그라운드 동기화
- 네이티브 앱 경험

### 성능 최적화
- 이미지 레이지 로딩
- CSS/JS 압축
- CDN 활용
- 캐싱 전략

## 💼 비즈니스 연락처

**프로젝트 문의 및 업무제휴**
- **이메일**: shin.jeiths@gmail.com
- **개발자**: jeiths (22년차 IT 시스템 엔지니어)
- **전문분야**: Legacy 시스템 DX, IBM MVS, Fujitsu Mainframe
- **현재**: 일본 스타트업 설립 구상 중

## 📜 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🤝 기여하기

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📈 로드맵

### 버전 1.1
- [ ] 실시간 채팅 기능
- [ ] 사용자 리뷰 시스템
- [ ] 음식 배달 연동

### 버전 1.2
- [ ] AR 메뉴 보기
- [ ] 음성 네비게이션
- [ ] 블록체인 포인트 시스템

---

**Made with ❤️ for Shinookubo Community**

*Legacy 시스템을 Modern DX로 전환하는 기술적 케이스 스터디*
