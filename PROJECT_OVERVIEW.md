# AI To BASE - 맞춤형 화장품 레시피 추천 앱

## 🎯 프로젝트 개요

**AI To BASE**는 설문을 통해 AI가 맞춤형 화장품 레시피를 추천해주는 웹 애플리케이션입니다.
사용자의 피부 상태와 선호도를 분석하여 개인별로 최적화된 화장품 제조 레시피를 제공합니다.

## 📱 핵심 기능

### 1. 다단계 설문 시스템
- **7개 파트별 설문**: 총 33개 기본 질문 + 5개 조건부 질문
- **자동 화면 전환**: 대부분 화면이 터치 액션 없이 자동으로 넘어감
- **부드러운 애니메이션**: 페이드 전환과 빠른 타이핑 애니메이션

### 2. AI 기반 피부 분석
- **9가지 피부 타입**: 각 타입별 맞춤형 디자인 카드
- **동적 피부 타입 결정**: AI 분석 결과에 따라 자동 분류
- **맞춤형 레시피 생성**: Make.com 자동화 워크플로우 연동

### 3. 완전 반응형 디자인
- **모바일 퍼스트**: 스마트폰 최적화 설계
- **데스크톱 지원**: PC에서도 완벽한 사용자 경험
- **Figma 디자인 복원**: 원본 디자인을 완벽하게 구현

## 🏗️ 기술 아키텍처

### Frontend Stack
```
React 18 + TypeScript + Vite
├── UI Framework: Tailwind CSS v4.0
├── Animation: Motion/React (Framer Motion)
├── Component Library: shadcn/ui
└── Build Tool: Vite
```

### Backend Architecture (3-Tier)
```
Frontend → Server → Database
├── Frontend: React SPA
├── Server: Supabase Edge Functions (Hono.js)
├── Database: Supabase PostgreSQL
└── Automation: Make.com Webhook Integration
```

### Key Dependencies
- **React + TypeScript**: 핵심 프레임워크
- **Motion/React**: 부드러운 애니메이션
- **Tailwind CSS v4**: 현대적 스타일링
- **Supabase**: 백엔드 서비스 (Auth, DB, Storage)
- **shadcn/ui**: 고품질 UI 컴포넌트

## 📂 프로젝트 구조

```
├── src/App.tsx                    # 메인 애플리케이션 로직
├── components/                    # 리액트 컴포넌트
│   ├── StartScreen.tsx           # 시작 화면
│   ├── IntroScreen.tsx           # 소개 화면
│   ├── GuideScreen.tsx           # 가이드 화면
│   ├── UserInfoForm.tsx          # 토스 스타일 정보 입력
│   ├── Part[1-7]Intro.tsx        # 각 파트별 인트로
│   ├── SurveyFlow.tsx            # 설문 플로우 관리
│   ├── AI_Report_Figma.tsx       # AI 분석 보고서
│   └── ui/                       # shadcn/ui 컴포넌트
├── data/                         # 데이터 정의
│   ├── surveyQuestions.tsx       # 설문 질문 데이터
│   └── skinTypeClassification.tsx # 피부 타입 분류 로직
├── utils/                        # 유틸리티
│   ├── supabase/                 # Supabase 연동
│   └── skinTypeMapping.tsx       # 피부 타입 매핑
├── imports/                      # Figma 디자인 복원 컴포넌트
│   ├── Group1707481052.tsx       # 탄력 메이커 카드
│   ├── Group1707481053.tsx       # 보송보송 카드
│   └── ...                       # 기타 피부 타입 카드들
└── supabase/functions/server/    # 백엔드 서버
    ├── index.tsx                 # Hono.js 서버
    └── kv_store.tsx             # 키-값 저장소 유틸
```

## 🎨 디자인 시스템

### 브랜드 컬러
- **Primary**: `#102A71` (보라색)
- **Background**: `#ffffff` (화이트)
- **Typography**: Pretendard 폰트 패밀리

### 애니메이션 철학
- **부드러운 전환**: ease-out 커브를 사용한 자연스러운 모션
- **타이핑 효과**: 실시간 텍스트 타이핑 애니메이션
- **페이드 전환**: 화면 간 부드러운 opacity 변화

### 반응형 전략
- **모바일 퍼스트**: 320px부터 지원
- **뷰포트 기반**: vw, vh 단위 활용
- **적응형 레이아웃**: 디바이스별 최적화

## 🔄 사용자 플로우

```
시작 화면 → 소개 화면 → 가이드 화면 → 사용자 정보 입력
    ↓
감사 인사 화면 → Part 1 (피부 상태) → Part 2 (생활습관)
    ↓
Part 3 (환경) → Part 4 (선호도) → Part 5 (트러블)
    ↓
Part 6 (케어) → Part 7 (목표) → 설문 완료
    ↓
AI 분석 대기 → 맞춤형 레시피 보고서
```

## 🤖 AI 통합 워크플로우

### 1. 데이터 수집
- 사용자 기본 정보 (이름, 나이)
- 7개 파트별 설문 답변
- 피부 타입 자동 분류

### 2. Make.com 자동화
```
Supabase 변경 감지 → Make.com 트리거
    ↓
AI 분석 API 호출 → 레시피 생성
    ↓
결과 데이터베이스 저장 → 사용자 알림
```

### 3. 결과 제공
- 피부 타입별 맞춤 디자인
- 성분별 상세 정보
- 제조 방법 단계별 안내
- 주의사항 및 팁

## 📊 데이터베이스 설계

### 주요 테이블
```sql
ai_cosmetic_surveys
├── id (UUID, Primary Key)
├── user_name (TEXT)
├── user_age (INTEGER)
├── skin_type (TEXT)
├── answers (JSONB)
├── status (TEXT)
├── ai_recommendation (JSONB)
└── timestamps
```

### 보안 정책
- Row Level Security (RLS) 적용
- 개인정보 암호화
- API 키 환경변수 관리

## 🚀 배포 및 운영

### 배포 환경
- **Frontend**: Vercel/Netlify
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **CDN**: Vercel Edge Network

### 환경 변수
```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
MAKE_WEBHOOK_URL=<your-make-webhook>
```

## ✨ 주요 특징

### 1. 사용자 경험 (UX)
- **직관적 인터페이스**: 복잡한 설문을 단순하게 만듦
- **빠른 로딩**: Lazy Loading과 코드 스플리팅
- **접근성**: 키보드 네비게이션과 스크린 리더 지원

### 2. 성능 최적화
- **번들 최적화**: Vite 기반 빌드 최적화
- **이미지 최적화**: WebP 형식과 적응형 로딩
- **캐싱**: 브라우저 캐시와 CDN 활용

### 3. 확장 가능성
- **모듈화**: 컴포넌트 기반 아키텍처
- **타입 안전성**: TypeScript 완전 적용
- **테스트**: 단위 테스트와 E2E 테스트 준비

## 🎯 비즈니스 가치

### 1. 개인화
- 사용자별 맞춤형 레시피 제공
- 피부 타입 기반 정확한 분석
- 지속적인 데이터 학습

### 2. 자동화
- Make.com을 통한 완전 자동화
- 수동 개입 없는 레시피 생성
- 실시간 결과 제공

### 3. 확장성
- 새로운 성분 추가 가능
- 다양한 화장품 타입 지원
- 국제화 준비 완료

---

**AI To BASE**는 현대적인 웹 기술과 AI를 결합하여 사용자에게 진정한 개인화 경험을 제공하는 혁신적인 플랫폼입니다.