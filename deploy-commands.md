# 🚀 원클릭 배포 명령어 모음

## 📋 사전 준비
```bash
# 1. Node.js 18+ 설치 확인
node --version

# 2. Git 설정 확인
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. GitHub CLI 설치 (선택사항)
# macOS: brew install gh
# Windows: winget install GitHub.cli
```

## 🔥 빠른 배포 명령어

### Netlify 원클릭 배포
```bash
# 1단계: 패키지 설치
npm install -g netlify-cli

# 2단계: 로그인
netlify login

# 3단계: 사이트 생성 및 배포
netlify init
netlify deploy --prod --dir=dist

# 또는 한번에:
npm run build && netlify deploy --prod --dir=dist
```

### Vercel 원클릭 배포
```bash
# 1단계: Vercel CLI 설치
npm install -g vercel

# 2단계: 배포 (자동으로 설정 진행)
vercel --prod

# 환경 변수 설정
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SUPABASE_PROJECT_ID
```

### GitHub Pages 원클릭 배포
```bash
# 1단계: gh-pages 패키지 설치
npm install --save-dev gh-pages

# 2단계: package.json에 스크립트 추가
# "deploy": "npm run build && gh-pages -d dist"

# 3단계: 배포
npm run deploy
```

## 🛠️ 자동화 스크립트

### 완전 자동 배포 스크립트
```bash
#!/bin/bash
# save as: auto-deploy.sh

echo "🚀 AI To BASE 완전 자동 배포 시작..."

# 의존성 체크
npm ci

# 린트 및 타입 체크
npm run lint
npm run typecheck

# 빌드
npm run build

# Git 커밋 & 푸시
git add .
git commit -m "🚀 Auto deploy: $(date)"
git push origin main

# 배포 (Netlify 또는 Vercel 선택)
if command -v netlify &> /dev/null; then
    echo "📡 Netlify로 배포 중..."
    netlify deploy --prod --dir=dist
elif command -v vercel &> /dev/null; then
    echo "▲ Vercel로 배포 중..."
    vercel --prod
else
    echo "⚠️ 배포 CLI가 설치되지 않았습니다."
fi

echo "✅ 배포 완료!"
```

### Windows용 배치 파일
```batch
@echo off
REM save as: deploy.bat

echo 🚀 AI To BASE 배포 시작...

REM 빌드
call npm run build
if errorlevel 1 goto :error

REM Git 커밋 & 푸시
git add .
git commit -m "Deploy: Production release"
git push origin main

REM 배포
call netlify deploy --prod --dir=dist

echo ✅ 배포 완료!
goto :end

:error
echo ❌ 빌드 실패!
pause

:end
pause
```

## 🔧 환경 변수 자동 설정

### .env 템플릿
```bash
# .env.example 파일 생성
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### 환경 변수 일괄 설정 (Vercel)
```bash
# env-setup.sh
vercel env add VITE_SUPABASE_URL production < .env.production
vercel env add VITE_SUPABASE_ANON_KEY production < .env.production
vercel env add VITE_SUPABASE_PROJECT_ID production < .env.production
```

## 📱 배포 상태 확인

### 헬스체크 스크립트
```bash
#!/bin/bash
# health-check.sh

URL="https://your-app.netlify.app"

echo "🔍 $URL 헬스체크 중..."

response=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $response -eq 200 ]; then
    echo "✅ 사이트가 정상 작동 중입니다!"
else
    echo "❌ 사이트에 문제가 있습니다. HTTP: $response"
fi

# Lighthouse CI 실행 (선택사항)
if command -v lhci &> /dev/null; then
    echo "🚦 Lighthouse 성능 테스트 중..."
    lhci autorun --upload.target=filesystem
fi
```

## 🎯 배포 후 자동 작업

### Slack 알림 (선택사항)
```bash
# slack-notify.sh
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"🎉 AI To BASE가 성공적으로 배포되었습니다! https://your-app.netlify.app"}' \
YOUR_SLACK_WEBHOOK_URL
```

### 성능 모니터링 설정
```bash
# lighthouse-ci.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

---

## 🎉 사용법

1. **스크립트 실행 권한 부여**:
   ```bash
   chmod +x deploy.sh
   chmod +x auto-deploy.sh
   ```

2. **배포 실행**:
   ```bash
   ./deploy.sh
   ```

3. **완전 자동 배포**:
   ```bash
   ./auto-deploy.sh
   ```

**축하합니다! 이제 원클릭으로 AI To BASE를 배포할 수 있습니다!** 🎊