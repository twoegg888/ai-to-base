# 반응형 디자인 가이드라인

## ⚠️ 필수 규칙: 모든 컴포넌트는 반드시 반응형으로 구현해야 함

### 브레이크포인트 기준
- **Mobile**: 기본 (320px~)
- **sm**: 640px~
- **md**: 768px~ 
- **lg**: 1024px~

### 반응형 적용 패턴

#### 1. 절대 위치 (left, top, right, bottom)
```tsx
// ❌ 잘못된 예
left-[766px] top-[207px]

// ✅ 올바른 예  
left-[300px] sm:left-[500px] md:left-[766px]
top-[120px] sm:top-[160px] md:top-[207px]
```

#### 2. 폰트 크기
```tsx
// ❌ 잘못된 예
text-[50px]

// ✅ 올바른 예
text-2xl sm:text-3xl md:text-4xl lg:text-[50px]
```

#### 3. 크기 (width, height, size)
```tsx
// ❌ 잘못된 예
size-[86px] w-[574px] h-[140px]

// ✅ 올바른 예
size-[50px] sm:size-[70px] md:size-[86px]
w-[320px] sm:w-[450px] md:w-[574px]
h-[100px] sm:h-[120px] md:h-[140px]
```

#### 4. 간격 (margin, padding)
```tsx
// ❌ 잘못된 예
mb-6 px-4

// ✅ 올바른 예
mb-4 sm:mb-5 md:mb-6
px-4 sm:px-6 md:px-8
```

### 체크리스트
- [ ] 모든 절대 위치값에 sm:, md: 적용
- [ ] 모든 폰트 크기에 반응형 적용
- [ ] 모든 width/height에 반응형 적용
- [ ] padding/margin에 반응형 적용
- [ ] 모바일에서 UI가 잘림 없이 표시되는지 확인

### 기본 컨테이너 패턴
```tsx
// 중앙 정렬 + 최대 너비 제한
<div className="w-full max-w-[320px] sm:max-w-[500px] md:max-w-[574px] px-4">
  
// 절대 위치 + 반응형
<div className="absolute left-1/2 top-[120px] sm:top-[160px] md:top-[207px] translate-x-[-50%]">
```

## ⚠️ 알림: 이 가이드라인을 무시하면 안됨!