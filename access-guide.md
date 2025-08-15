# 🌐 Lovely Shinookubo 접속 가이드

## 🚀 현재 서버 상태
- **포트**: 8080
- **로컬 접속**: ✅ http://localhost:8080
- **서버 상태**: 정상 실행 중

## 🔧 Cloud Shell Web Preview 사용법

### 1. Cloud Shell에서 Web Preview 열기
```bash
# Cloud Shell 터미널에서 다음 버튼 클릭:
# [Web Preview] 버튼 → [Preview on port 8080]
```

### 2. 또는 직접 URL 접속
```
# Cloud Shell Web Preview URL 형식:
https://8080-cs-{PROJECT_ID}-default.{REGION}.cloudshell.dev

# 예시:
https://8080-cs-custom-temple-427808-e0-default.us-central1.cloudshell.dev
```

### 3. 웹 애플리케이션 접속
```
# 프록시 서버 (API):
https://8080-cs-{PROJECT_ID}-default.{REGION}.cloudshell.dev/health

# 웹 애플리케이션:
# 별도 포트에서 웹 서버 실행 필요
python3 -m http.server 8000
# 그 후 8000 포트로 Web Preview 열기
```

## 📊 API 테스트 엔드포인트

### Health Check
```bash
curl https://8080-cs-{PROJECT_ID}-default.{REGION}.cloudshell.dev/health
```

### API Status
```bash
curl https://8080-cs-{PROJECT_ID}-default.{REGION}.cloudshell.dev/api/status
```

### Weather API
```bash
curl "https://8080-cs-{PROJECT_ID}-default.{REGION}.cloudshell.dev/api/weather?lat=35.7040&lon=139.7052"
```

### Google Places Search
```bash
curl "https://8080-cs-{PROJECT_ID}-default.{REGION}.cloudshell.dev/api/places/nearbysearch/json?location=35.7040,139.7052&radius=500&keyword=삼겹살&type=restaurant&language=ko"
```

## 🛠️ 개발 환경 설정

### 1. 프록시 서버 (포트 8080)
```bash
cd /data/ijswork/lovely-shinookubo-repo
node proxy-server.js
```

### 2. 웹 서버 (포트 8000)
```bash
# 새 터미널에서:
cd /data/ijswork/lovely-shinookubo-repo
python3 -m http.server 8000
```

### 3. 브라우저에서 접속
- **API 서버**: Web Preview → Port 8080
- **웹 앱**: Web Preview → Port 8000 → index-final.html

## 🔍 트러블슈팅

### 포트 확인
```bash
netstat -tlnp | grep -E "(8080|8000)"
```

### 프로세스 확인
```bash
ps aux | grep -E "(node|python)"
```

### 로그 확인
```bash
tail -f proxy-server.log
```

## 📝 참고사항

- Cloud Shell의 Web Preview는 Google 계정으로 인증된 사용자만 접속 가능
- 외부 공개 접속을 위해서는 방화벽 규칙 추가 필요
- 현재는 개발 및 테스트 목적으로 Cloud Shell 환경에서 사용