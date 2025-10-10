# AI To BASE - 맞춤형 화장품 레시피 앱

AI가 분석하는 나만의 맞춤형 화장품 레시피를 제공하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **AI 피부 분석**: 설문을 통한 개인별 피부 타입 분석
- **맞춤형 레시피**: AI가 추천하는 개인화된 화장품 레시피
- **토스급 UI/UX**: 부드러운 애니메이션과 직관적인 인터페이스
- **모바일 최적화**: 모든 디바이스에서 완벽한 사용자 경험

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Motion (Framer Motion)
- **Backend**: Supabase (Database + Edge Functions)
- **Deployment**: Netlify
- **AI Integration**: Make.com + Custom AI API

## 📱 배포 URL

🔗 **Live Demo**: [https://ai-to-base.netlify.app](https://ai-to-base.netlify.app)

## 🔧 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd ai-to-base
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAKE_WEBHOOK_URL=your_make_webhook_url
```

### 4. 개발 서버 실행
```bash
npm run dev
```

## 🚀 배포 가이드

### Netlify 배포

1. **GitHub 연동**
   - Netlify 대시보드에서 "New site from Git" 선택
   - GitHub 저장소 연결

2. **빌드 설정**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **환경 변수 설정**
   - Netlify 대시보드 > Site settings > Environment variables
   - 필요한 환경 변수들을 추가

### 환경 변수 목록

| 변수명 | 설명 | 필수 여부 |
|--------|------|-----------|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ 필수 |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anonymous Key | ✅ 필수 |
| `VITE_MAKE_WEBHOOK_URL` | Make.com 웹훅 URL | ✅ 필수 |

## 📂 프로젝트 구조

```
src/
├── components/          # React 컴포넌트들
│   ├── ui/             # ShadCN UI 컴포넌트
│   └── figma/          # Figma 관련 컴포넌트
├── data/               # 설문 데이터 및 상수
├── utils/              # 유틸리티 함수들
│   └── supabase/       # Supabase 관련 함수
├── styles/             # 글로벌 스타일
└── supabase/           # Supabase 함수들
    └── functions/      # Edge Functions
```

## 🎨 디자인 시스템

- **브랜드 컬러**: `#102A71` (Deep Blue)
- **디자인 컨셉**: 토스를 뛰어넘는 깔끔한 모바일 퍼스트 디자인
- **애니메이션**: Motion (Framer Motion)을 활용한 부드러운 전환
- **타이포그래피**: Pretendard 폰트 기반 일관된 타이포그래피

## 🧪 AI 분석 플로우

1. **사용자 정보 수집**: 이름, 나이 입력
2. **설문 진행**: 피부 타입 및 선호도 조사
3. **데이터 전송**: Supabase에 설문 결과 저장
4. **AI 분석 트리거**: Make.com 시나리오 자동 실행
5. **결과 제공**: 맞춤형 화장품 레시피 생성

## 📱 PWA 기능

- **오프라인 지원**: 서비스 워커를 통한 캐싱
- **앱 설치**: 홈 화면에 앱 추가 가능
- **푸시 알림**: 레시피 완성 시 알림 (선택사항)

## 🔐 보안 및 최적화

- **CSP 헤더**: XSS 공격 방지
- **코드 스플리팅**: 번들 크기 최적화
- **이미지 최적화**: WebP 형식 지원
- **SEO 최적화**: 메타 태그 및 구조화된 데이터

## 📊 성능 지표

- **Lighthouse Score**: 95+ (모든 카테고리)
- **First Paint**: < 1초
- **Time to Interactive**: < 2초
- **Bundle Size**: < 500KB (gzipped)

## 🐛 문제 해결

### 일반적인 문제들

1. **빌드 실패**
   ```bash
   # 캐시 정리 후 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **환경 변수 인식 안됨**
   - `VITE_` 접두사가 있는지 확인
   - Netlify에서 환경 변수 설정 확인

3. **Supabase 연결 오류**
   - URL과 Key 값 재확인
   - RLS 정책 설정 확인

## 📄 라이선스

MIT License

## 👥 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 도움이 필요한 경우:
- GitHub Issues에 문의
- 이메일: support@ai-to-base.com

---

**Made with ❤️ by AI To BASE Team**