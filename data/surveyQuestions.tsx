import type { QuestionData } from '../components/QuestionCard';
export type { QuestionData };

// Part별 정의
export const surveyParts = [
  { 
    id: 1,
    partNumber: 1, 
    title: "기본 피부/사용자 정보", 
    description: "피부 타입과 기본적인 관리 습관을 알려주세요",
    questionCount: 5,
    startIndex: 0,
    endIndex: 4
  },
  { 
    id: 2,
    partNumber: 2, 
    title: "선호 제품", 
    description: "어떤 제품을 선호하시는지 알려주세요",
    questionCount: 6,
    startIndex: 5,
    endIndex: 10
  },
  { 
    id: 3,
    partNumber: 3, 
    title: "환경/라이프스타일", 
    description: "생활 패턴과 환경에 대해 알려주세요",
    questionCount: 7,
    startIndex: 11,
    endIndex: 17
  },
  { 
    id: 4,
    partNumber: 4, 
    title: "건강/운동", 
    description: "건강 관리와 운동 습관에 대해 알려주세요",
    questionCount: 2,
    startIndex: 18,
    endIndex: 19
  },
  { 
    id: 5,
    partNumber: 5, 
    title: "피부 관리 습관", 
    description: "평소 피부 관리 방법에 대해 알려주세요",
    questionCount: 6,
    startIndex: 20,
    endIndex: 25
  },
  { 
    id: 6,
    partNumber: 6, 
    title: "메이크업 선호도", 
    description: "메이크업 스타일과 선호도에 대해 알려주세요",
    questionCount: 4,
    startIndex: 26,
    endIndex: 29
  },
  { 
    id: 7,
    partNumber: 7, 
    title: "가치관/목표", 
    description: "화장품에 대한 가치관과 목표를 알려주세요",
    questionCount: 3,
    startIndex: 30,
    endIndex: 32
  }
];

export const surveyQuestions: QuestionData[] = [
  // Part 1: 기본 피부/사용자 정보 (5문항)
  {
    id: 'skin_type',
    title: "'{userName}'님의 피부 타입은<br/>무엇인가요?",
    options: [
      { id: 'dry', label: '건성 (건조한 피부)' },
      { id: 'oily', label: '지성 (기름 많은 피부)' },
      { id: 'unknown', label: '잘 모르겠음' },
      { id: 'combination', label: '복합성 (부분마다 다름)' },
      { id: 'sensitive', label: '민감성 (쉽게 자극 받음)' }
    ]
  },
  {
    id: 'skin_concerns',
    title: "피부 고민이 있다면<br/>무엇인가요?",
    allowMultiple: true,
    options: [
      { id: 'acne', label: '여드름/트러블' },
      { id: 'sebum', label: '피지분비 & 번들거림' },
      { id: 'wrinkles', label: '주름/노화' },
      { id: 'dryness', label: '건조함/당김' },
      { id: 'pigmentation', label: '색소침착/잡티 (기미, 주근깨 등)' },
      { id: 'none', label: '특별한 고민 없음' }
    ]
  },
  {
    id: 'skincare_routine',
    title: "스킨케어 루틴은<br/>어느 정도인가요?",
    options: [
      { id: 'none', label: '하지 않음' },
      { id: 'basic', label: '기본 (스킨+로션+크림)' },
      { id: 'extended', label: '확장 (기본 + 세럼, 앰플 등 추가 제품)' },
      { id: 'full', label: '풀케어 (확장 이상, 다양한 제품 사용)' }
    ]
  },
  {
    id: 'makeup_frequency',
    title: "화장 빈도는<br/>어느 정도인가요?",
    options: [
      { id: 'rarely', label: '거의 안 함' },
      { id: 'special', label: '가끔 (특별한 날만)' },
      { id: 'weekend', label: '주말/외출할 때' },
      { id: 'daily', label: '매일' }
    ]
  },
  {
    id: 'makeup_style',
    title: "메이크업 스타일<br/>선호도는?",
    options: [
      { id: 'light', label: '가벼운 메이크업' },
      { id: 'daily', label: '데일리 메이크업' },
      { id: 'heavy', label: '진한 메이크업' },
      { id: 'korean', label: '한국식 메이크업' },
      { id: 'western', label: '서구식 메이크업' }
    ]
  },

  // Part 2: 선호 제품 (6문항)
  {
    id: 'product_preference',
    title: "선호하는 제품<br/>타입이 있나요?",
    allowMultiple: true,
    options: [
      { id: 'domestic', label: '국내 제품' },
      { id: 'foreign', label: '해외 제품' },
      { id: 'medical', label: '의료용 화장품' },
      { id: 'no_preference', label: '브랜드 상관없음' }
    ]
  },
  {
    id: 'allergies',
    title: "알레르기/피해야 할<br/>성분이 있나요?",
    allowMultiple: true,
    options: [
      { id: 'fragrance', label: '향료' },
      { id: 'alcohol', label: '알코올' },
      { id: 'paraben', label: '파라벤' },
      { id: 'silicone', label: '실리콘' },
      { id: 'none', label: '특별히 없음' }
    ]
  },
  {
    id: 'product_priority',
    title: "제품 선택 시 가장<br/>중요하게 보는 점은?",
    options: [
      { id: 'ingredient', label: '성분/효과' },
      { id: 'brand', label: '신뢰할 수 있는 브랜드' },
      { id: 'review', label: '후기/평점' },
      { id: 'convenience', label: '사용 편리함' },
      { id: 'natural', label: '천연 성분' }
    ]
  },
  {
    id: 'skincare_effects_interest',
    title: "관심 있는 스킨케어 효과는<br/>무엇인가요?",
    allowMultiple: true,
    options: [
      { id: 'moisture', label: '수분 공급' },
      { id: 'soothing', label: '진정/민감 케어' },
      { id: 'sebum_control', label: '유분/피지 조절' },
      { id: 'whitening', label: '미백/톤업' },
      { id: 'anti_aging', label: '주름/탄력 개선' },
      { id: 'acne_care', label: '여드름/트러블 케어' }
    ]
  },
  {
    id: 'important_product_features',
    title: "가장 중요하게 생각하는<br/>제품 특성은 무엇인가요?",
    allowMultiple: true,
    options: [
      { id: 'fast_absorption', label: '빠른 흡수력 (끈적임 없는 마무리)' },
      { id: 'long_lasting_moisture', label: '장시간 지속되는 보습력' },
      { id: 'gentle_ingredients', label: '피부 자극 없는 순한 성분' },
      { id: 'light_texture', label: '가벼운 텍스처 (로션 타입)' },
      { id: 'rich_texture', label: '리치한 텍스처 (크림 타입)' },
      { id: 'eco_friendly', label: '환경 친화적인 성분 (비건/천연 성분)' }
    ]
  },
  {
    id: 'repurchase_criteria',
    title: "제품을 다시 사게 되는<br/>이유는?",
    options: [
      { id: 'satisfaction', label: '만족도' },
      { id: 'effectiveness', label: '효과' },
      { id: 'convenience', label: '구매 편리성' },
      { id: 'habit', label: '사용 습관' },
      { id: 'loyalty', label: '브랜드 충성도' }
    ]
  },

  // Part 3: 환경/라이프스타일 (7문항)
  {
    id: 'season_concern',
    title: "계절별 피부 변화가<br/>있나요?",
    options: [
      { id: 'spring', label: '봄 (환절기 민감)' },
      { id: 'summer', label: '여름 (땀/유분 많음)' },
      { id: 'fall', label: '가을 (건조해짐)' },
      { id: 'winter', label: '겨울 (심한 건조, 각질)' },
      { id: 'no_change', label: '계절 차이 없음' }
    ]
  },
  {
    id: 'lifestyle',
    title: "라이프스타일은<br/>어떤가요?",
    allowMultiple: true,
    options: [
      { id: 'indoor', label: '실내 활동 많음' },
      { id: 'outdoor', label: '야외 활동 많음' },
      { id: 'irregular', label: '늦게 자거나 불규칙한 생활' },
      { id: 'exercise', label: '운동/헬스 자주 함' },
      { id: 'stress', label: '스트레스 환경' }
    ]
  },
  {
    id: 'sun_exposure',
    title: "햇빛 노출 시간은<br/>하루에 얼마나?",
    options: [
      { id: 'almost_none', label: '거의 없음' },
      { id: 'under_1hour', label: '1시간 이내' },
      { id: '1_3hours', label: '1-3시간' },
      { id: '3_5hours', label: '3-5시간' },
      { id: 'over_5hours', label: '5시간 이상' }
    ]
  },
  {
    id: 'sunscreen_usage',
    title: "자외선 차단제<br/>사용 빈도는?",
    options: [
      { id: 'rarely', label: '거의 안 바름' },
      { id: 'summer_only', label: '여름에만 바름' },
      { id: 'outdoor_only', label: '외출할 때만 바름' },
      { id: 'daily', label: '매일 바름' },
      { id: 'multiple', label: '하루 여러 번 바름' }
    ]
  },
  {
    id: 'water_intake',
    title: "하루 물 섭취량은<br/>어느 정도인가요?",
    options: [
      { id: 'under_1L', label: '1L 미만' },
      { id: '1_1.5L', label: '1-1.5L' },
      { id: '1.5_2L', label: '1.5-2L' },
      { id: '2_2.5L', label: '2-2.5L' },
      { id: 'over_2.5L', label: '2.5L 이상' }
    ]
  },
  {
    id: 'sleep_hours',
    title: "하루 평균 수면 시간은<br/>얼마나 되나요?",
    options: [
      { id: 'under_5hours', label: '5시간 미만' },
      { id: '5_6hours', label: '5-6시간' },
      { id: '6_7hours', label: '6-7시간' },
      { id: '7_8hours', label: '7-8시간' },
      { id: 'over_8hours', label: '8시간 이상' }
    ]
  },
  {
    id: 'stress_level',
    title: "스트레스 정도는<br/>어떤가요?",
    options: [
      { id: 'very_low', label: '매우 낮음' },
      { id: 'low', label: '낮음' },
      { id: 'medium', label: '보통' },
      { id: 'high', label: '높음' },
      { id: 'very_high', label: '매우 높음' }
    ]
  },

  // Part 4: 건강/운동 (2문항)
  {
    id: 'diet_type',
    title: "식습관은<br/>어떤가요?",
    options: [
      { id: 'healthy', label: '건강하게 먹는 편' },
      { id: 'irregular', label: '불규칙함' },
      { id: 'fast_food', label: '패스트푸드 위주' },
      { id: 'vegetarian', label: '채식 위주' },
      { id: 'balanced', label: '균형잡힌 식단' }
    ]
  },
  {
    id: 'exercise_frequency',
    title: "운동 빈도는<br/>어느 정도인가요?",
    options: [
      { id: 'rarely', label: '거의 안 함' },
      { id: 'monthly', label: '월 1-2회' },
      { id: 'weekly', label: '주 1-2회' },
      { id: 'frequent', label: '주 3-4회' },
      { id: 'daily', label: '거의 매일' }
    ]
  },

  // Part 5: 피부 관리 습관 (6문항)
  {
    id: 'cleansing_method',
    title: "세안 방법은<br/>무엇인가요?",
    options: [
      { id: 'water_only', label: '물로만 세안' },
      { id: 'cleanser', label: '클렌징폼/젤' },
      { id: 'oil_cleansing', label: '오일 클렌징' },
      { id: 'double_cleansing', label: '이중 세안' },
      { id: 'cleansing_water', label: '클렌징 워터' }
    ]
  },
  {
    id: 'exfoliation_frequency',
    title: "각질 제거 빈도는<br/>어떻게 되나요?",
    options: [
      { id: 'rarely', label: '거의 안 함' },
      { id: 'monthly', label: '월 1-2회' },
      { id: 'weekly', label: '주 1회' },
      { id: 'twice_weekly', label: '주 2회' },
      { id: 'daily', label: '매일' }
    ]
  },
  {
    id: 'mask_usage',
    title: "팩/마스크 사용<br/>빈도는?",
    options: [
      { id: 'rarely', label: '거의 안 함' },
      { id: 'monthly', label: '월 1-2회' },
      { id: 'weekly', label: '주 1회' },
      { id: 'twice_weekly', label: '주 2-3회' },
      { id: 'daily', label: '거의 매일' }
    ]
  },
  {
    id: 'skincare_time',
    title: "스킨케어 시간은<br/>얼마나 되나요?",
    options: [
      { id: 'under_5min', label: '5분 이내' },
      { id: '5_10min', label: '5-10분' },
      { id: '10_20min', label: '10-20분' },
      { id: '20_30min', label: '20-30분' },
      { id: 'over_30min', label: '30분 이상' }
    ]
  },
  {
    id: 'skin_sensitivity_level',
    title: "피부 민감도는<br/>어느 정도인가요?",
    options: [
      { id: 'very_sensitive', label: '매우 민감함' },
      { id: 'sensitive', label: '민감함' },
      { id: 'normal', label: '보통' },
      { id: 'strong', label: '튼튼한 편' },
      { id: 'very_strong', label: '매우 튼튼함' }
    ]
  },
  {
    id: 'skin_texture',
    title: "피부 결 상태는<br/>어떤가요?",
    options: [
      { id: 'smooth', label: '매끄러움' },
      { id: 'rough', label: '거칠음' },
      { id: 'uneven', label: '울퉁불퉁함' },
      { id: 'soft', label: '부드러움' },
      { id: 'normal', label: '보통' }
    ]
  },

  // Part 6: 메이크업 선호도 (4문항)
  {
    id: 'pore_size',
    title: "모공 크기 고민은<br/>어느 정도인가요?",
    options: [
      { id: 'very_large', label: '매우 큼' },
      { id: 'large', label: '큼' },
      { id: 'normal', label: '보통' },
      { id: 'small', label: '작음' },
      { id: 'no_concern', label: '신경 안 씀' }
    ]
  },
  {
    id: 'color_preference',
    title: "선호하는 컬러톤은<br/>무엇인가요?",
    options: [
      { id: 'warm', label: '웜톤 (노란기, 따뜻한 느낌이 도는 피부톤)' },
      { id: 'cool', label: '쿨톤 (푸른기, 시원하고 맑은 느낌의 피부톤)' },
      { id: 'neutral', label: '뉴트럴톤 (웜과 쿨의 중간, 두 톤 모두 잘 어울림)' },
      { id: 'vivid', label: '화려한 컬러 (톤과 상관없이 선명하고 강렬한 색 선호)' },
      { id: 'no_preference', label: '상관없음 (특별한 선호 없음)' }
    ]
  },
  {
    id: 'coverage_preference',
    title: "베이스 메이크업<br/>커버력 선호도는?",
    options: [
      { id: 'very_light', label: '매우 가벼움' },
      { id: 'light', label: '가벼움' },
      { id: 'medium', label: '보통' },
      { id: 'full', label: '커버력 있음' },
      { id: 'heavy', label: '완전 커버' }
    ]
  },
  {
    id: 'makeup_longevity',
    title: "메이크업 지속력은<br/>얼마나 중요한가요?",
    options: [
      { id: 'not_important', label: '중요하지 않음' },
      { id: 'somewhat', label: '조금 중요' },
      { id: 'important', label: '중요함' },
      { id: 'very_important', label: '매우 중요함' },
      { id: 'essential', label: '꼭 필요함' }
    ]
  },

  // Part 7: 가치관/목표 (3문항)
  {
    id: 'environmental_concern',
    title: "친환경/비건 관심도는<br/>어느 정도인가요?",
    options: [
      { id: 'very_important', label: '매우 중요함' },
      { id: 'important', label: '중요함' },
      { id: 'somewhat', label: '어느 정도' },
      { id: 'not_much', label: '별로 없음' },
      { id: 'not_at_all', label: '전혀 없음' }
    ]
  },
  {
    id: 'packaging_importance',
    title: "패키징/디자인<br/>중요도는?",
    options: [
      { id: 'very_important', label: '매우 중요함' },
      { id: 'important', label: '중요함' },
      { id: 'somewhat', label: '어느 정도' },
      { id: 'not_much', label: '별로 없음' },
      { id: 'not_at_all', label: '전혀 없음' }
    ]
  },
  {
    id: 'effect_intensity_preference',
    title: "제품 사용 시 원하는<br/>효과 강도는?",
    options: [
      { id: 'gentle', label: '순한 효과 (저강도, 민감한 피부용)' },
      { id: 'moderate', label: '보통 효과 (일반적인 피부 관리)' },
      { id: 'strong', label: '강력한 효과 (집중 관리, 특정 고민 해결)' }
    ]
  }
];

// 설문 결과를 위한 타입 정의
export interface SurveyAnswers {
  [questionId: string]: string | string[];
}

// 조건부 질문 정의
export interface ConditionalQuestion extends QuestionData {
  isConditional: true;
  condition: {
    questionId: string;
    requiredAnswers: string[];
  };
}

// 조건부 질문들 정의 (5개)
export const conditionalQuestions: ConditionalQuestion[] = [
  // 민감성 피부 관련 추가 질문
  {
    id: 'sensitive_triggers',
    title: "피부가 민감해지는<br/>주요 원인은 무엇인가요?",
    allowMultiple: true,
    isConditional: true,
    condition: {
      questionId: 'skin_type',
      requiredAnswers: ['sensitive']
    },
    options: [
      { id: 'weather', label: '날씨 변화' },
      { id: 'cosmetics', label: '특정 화장품' },
      { id: 'stress', label: '스트레스' },
      { id: 'hormones', label: '호르몬 변화' },
      { id: 'food', label: '음식' }
    ]
  },
  
  // 여드름/트러블 관련 추가 질문
  {
    id: 'acne_severity',
    title: "여드름/트러블의<br/>정도는 어떤가요?",
    isConditional: true,
    condition: {
      questionId: 'skin_concerns',
      requiredAnswers: ['acne']
    },
    options: [
      { id: 'mild', label: '가벼움 (가끔 몇 개)' },
      { id: 'moderate', label: '보통 (주기적 발생)' },
      { id: 'severe', label: '심함 (지속적)' },
      { id: 'cystic', label: '낭종성 여드름' },
      { id: 'blackheads', label: '주로 블랙헤드' }
    ]
  },

  // 안티에이징 관련 추가 질문
  {
    id: 'aging_focus_areas',
    title: "노화가 가장 신경쓰이는<br/>부위는 어디인가요?",
    allowMultiple: true,
    isConditional: true,
    condition: {
      questionId: 'skin_concerns',
      requiredAnswers: ['wrinkles']
    },
    options: [
      { id: 'eye_area', label: '눈가' },
      { id: 'forehead', label: '이마' },
      { id: 'nasolabial', label: '팔자주름' },
      { id: 'neck', label: '목' },
      { id: 'overall', label: '전체적인 탄력' }
    ]
  },

  // 건조함 관련 추가 질문
  {
    id: 'dryness_severity',
    title: "건조함의 정도는<br/>어떤가요?",
    isConditional: true,
    condition: {
      questionId: 'skin_concerns',
      requiredAnswers: ['dryness']
    },
    options: [
      { id: 'mild', label: '약간 건조함' },
      { id: 'moderate', label: '보통 건조함' },
      { id: 'severe', label: '심한 건조함' },
      { id: 'flaky', label: '각질까지 일어남' },
      { id: 'tight', label: '당기는 느낌 심함' }
    ]
  },

  // 색소침착 관련 추가 질문
  {
    id: 'pigmentation_type',
    title: "색소침착의 종류는<br/>어떤 것인가요?",
    allowMultiple: true,
    isConditional: true,
    condition: {
      questionId: 'skin_concerns',
      requiredAnswers: ['pigmentation']
    },
    options: [
      { id: 'melasma', label: '기미' },
      { id: 'freckles', label: '주근깨' },
      { id: 'post_acne', label: '여드름 자국' },
      { id: 'age_spots', label: '노인성 반점' },
      { id: 'uneven_tone', label: '전체적인 톤 불균형' }
    ]
  }
];

// 동적 질문 생성 함수
export function generateDynamicQuestions(answers: SurveyAnswers): QuestionData[] {
  const dynamicQuestions: QuestionData[] = [...surveyQuestions];
  
  conditionalQuestions.forEach(conditionalQ => {
    const { questionId, requiredAnswers } = conditionalQ.condition;
    const userAnswer = answers[questionId];
    
    // 조건 확인: 단일 답변 또는 다중 답변 모두 지원
    const shouldAddQuestion = requiredAnswers.some(required => {
      if (Array.isArray(userAnswer)) {
        return userAnswer.includes(required);
      }
      return userAnswer === required;
    });
    
    if (shouldAddQuestion) {
      // 조건부 질문을 적절한 위치에 삽입
      const baseQuestionIndex = dynamicQuestions.findIndex(q => q.id === questionId);
      if (baseQuestionIndex !== -1) {
        // 기본 질문 바로 다음에 삽입
        dynamicQuestions.splice(baseQuestionIndex + 1, 0, {
          id: conditionalQ.id,
          title: conditionalQ.title,
          options: conditionalQ.options,
          allowMultiple: conditionalQ.allowMultiple
        });
      }
    }
  });
  
  return dynamicQuestions;
}

// Part별 질문 가져오기
export function getQuestionsByPart(partId: number): QuestionData[] {
  const part = surveyParts.find(p => p.id === partId);
  if (!part) return [];
  
  return surveyQuestions.slice(part.startIndex, part.startIndex + part.questionCount);
}

// 현재 질문이 속한 Part 찾기
export function getCurrentPart(questionIndex: number): typeof surveyParts[0] | null {
  for (const part of surveyParts) {
    if (questionIndex >= part.startIndex && questionIndex < part.startIndex + part.questionCount) {
      return part;
    }
  }
  return null;
}

// 설문 진행 상태 계산 (백분율 반환)
export function getQuestionProgress(currentIndex: number): number {
  return Math.round(((currentIndex + 1) / surveyQuestions.length) * 100);
}

// 상세 진행 상태 계산
export function getDetailedProgress(currentIndex: number): { 
  current: number; 
  total: number; 
  percentage: number;
  currentPart: number;
  totalParts: number;
} {
  const currentPart = getCurrentPart(currentIndex);
  
  return {
    current: currentIndex + 1,
    total: surveyQuestions.length,
    percentage: getQuestionProgress(currentIndex),
    currentPart: currentPart?.id || 1,
    totalParts: surveyParts.length
  };
}

// 특정 질문 찾기
export function getQuestionById(questionId: string): QuestionData | undefined {
  return surveyQuestions.find(q => q.id === questionId);
}