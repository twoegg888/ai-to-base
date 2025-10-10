# 🚀 AI To BASE - 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 필수 파일들
- [x] package.json (의존성 설정 완료)
- [x] vite.config.ts (빌드 최적화 완료)
- [x] netlify.toml (Netlify 배포 설정)
- [x] vercel.json (Vercel 배포 설정)
- [x] index.html (SEO 메타태그 완료)
- [x] manifest.json (PWA 설정 완료)

### ✅ 환경 변수
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## 🔧 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일 생성:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드 테스트
```bash
npm run build
npm run preview
```

## 🌐 배포 방법

### Method 1: Netlify (권장)

#### 자동 배포
1. GitHub에 코드 푸시
2. Netlify 대시보드에서 "New site from Git" 선택
3. GitHub repository 연결
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
5. 환경 변수 설정 (Site settings > Environment variables)

#### 수동 배포
```bash
# 빌드
npm run build

# Netlify CLI 설치 및 배포
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Method 2: Vercel

#### 자동 배포
1. GitHub에 코드 푸시
2. Vercel 대시보드에서 프로젝트 import
3. 환경 변수 설정

#### CLI 배포
```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
```

### Method 3: GitHub Pages

#### GitHub Actions 설정
`.github/workflows/deploy.yml` 파일 생성:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_SUPABASE_PROJECT_ID: ${{ secrets.VITE_SUPABASE_PROJECT_ID }}
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 📱 배포 후 확인사항

### 1. 기능 테스트
- [ ] 설문 시작 및 완료
- [ ] Supabase 연결 확인
- [ ] AI 레시피 생성 테스트
- [ ] 소셜미디어 공유 기능

### 2. 성능 확인
- [ ] Lighthouse 점수 (95+ 목표)
- [ ] 모바일 반응형 확인
- [ ] PWA 설치 기능

### 3. SEO 확인
- [ ] 메타태그 정상 표시
- [ ] Open Graph 이미지 확인
- [ ] 구조화 데이터 검증

## 🔧 문제 해결

### 빌드 오류 시
```bash
# 캐시 정리
rm -rf node_modules package-lock.json
npm install

# TypeScript 체크
npm run typecheck

# 린트 확인
npm run lint
```

### 환경 변수 오류 시
1. `VITE_` 접두사 확인
2. 배포 플랫폼에서 환경 변수 재설정
3. 빌드 로그에서 오류 메시지 확인

### Supabase 연결 오류 시
1. URL과 키 값 재확인
2. RLS 정책 설정 확인
3. Edge Functions 상태 확인

## 🎯 성능 최적화 팁

### 1. 이미지 최적화
- WebP 형식 사용
- 적절한 크기로 압축

### 2. 코드 분할
- 현재 설정된 chunk 분할 활용
- 지연 로딩 구현

### 3. 캐싱 최적화
- 정적 파일 장기 캐싱 설정
- Service Worker 활용

## 📊 모니터링 설정

### Google Analytics (선택사항)
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (선택사항)
```bash
# Sentry 설치
npm install @sentry/react @sentry/tracing
```

---

## 🎉 배포 완료 후

배포가 성공하면 다음 URL들이 생성됩니다:

- **Netlify**: `https://your-app-name.netlify.app`
- **Vercel**: `https://your-app-name.vercel.app`
- **Custom Domain**: 원하는 도메인 연결 가능

축하합니다! AI To BASE가 성공적으로 배포되었습니다! 🎊