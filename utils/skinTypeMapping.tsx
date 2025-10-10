// AI 추천 결과 → 피부 타입 카드 매핑 시스템

import Group1707481052 from '../imports/Group1707481052'; // 탄력 메이커 (산호핑크)
import Group1707481053 from '../imports/Group1707481053'; // 보송보송 (민트그린)
import Group1707481054 from '../imports/Group1707481054'; // 진정진정 (라이트그린)
import Group1707481055 from '../imports/Group1707481055'; // 민감 케어 (블루)
import Group1707481056 from '../imports/Group1707481056'; // 피부 톤 케어 (골드)
import Group1707481057 from '../imports/Group1707481057'; // 굳건한 보호장벽 (오렌지)
import Group1707481058 from '../imports/Group1707481058'; // 보습 (미디엄 블루)
import Group1707481059 from '../imports/Group1707481059'; // 산뜻 보습 (라이트 블루)
import Group1707481060 from '../imports/Group1707481060'; // 보습보습 (다크 블루)

export interface SkinTypeDesign {
  component: React.ComponentType<{ userName: string }>;
  title: string;
  backgroundColor: string;
  description: string;
}

// 9개 피부 타입 디자인 정의
export const skinTypeDesigns: Record<string, SkinTypeDesign> = {
  // 탄력/안티에이징 관련
  'elasticity': {
    component: Group1707481052,
    title: '탄력 메이커',
    backgroundColor: '#ff8788',
    description: '탄력과 안티에이징에 특화된 케어'
  },

  // 유분 조절/지성 피부 관련  
  'oily': {
    component: Group1707481053,
    title: '보송보송',
    backgroundColor: '#69db7c',
    description: '유분 조절과 깔끔한 마무리'
  },

  // 진정/트러블 케어 관련
  'acne': {
    component: Group1707481054,
    title: '진정진정', 
    backgroundColor: '#94d82d',
    description: '트러블 진정과 염증 완화'
  },

  // 민감성/예민한 피부 관련
  'sensitive': {
    component: Group1707481055,
    title: '민감 케어',
    backgroundColor: '#349aef',
    description: '민감하고 예민한 피부를 위한 순한 케어'
  },

  // 브라이트닝/톤 개선 관련
  'brightening': {
    component: Group1707481056,
    title: '피부 톤 케어',
    backgroundColor: '#ffd43a',
    description: '브라이트닝과 톤 개선 케어'
  },

  // 보호/배리어 강화 관련
  'barrier': {
    component: Group1707481057,
    title: '굳건한 보호장벽',
    backgroundColor: '#fe932d', 
    description: '피부 장벽 강화와 보호'
  },

  // 보습 관련 (3단계)
  'hydration': {
    component: Group1707481058,
    title: '보습',
    backgroundColor: '#7abdf2',
    description: '기본적인 수분 공급과 보습'
  },

  'light_hydration': {
    component: Group1707481059,
    title: '산뜻 보습',
    backgroundColor: '#a4d8ff',
    description: '가벼우면서도 촉촉한 보습'
  },

  'intensive_hydration': {
    component: Group1707481060,
    title: '보습보습',
    backgroundColor: '#1c7ed7',
    description: '집중적인 수분 공급과 깊은 보습'
  }
};

// AI 추천 결과 분석 → 피부 타입 결정 함수
export function analyzeSkinTypeFromAI(aiRecommendation: any): string {
  // AI 추천 결과가 없는 경우 기본값
  if (!aiRecommendation) {
    return 'hydration';
  }

  // 1. recipeTitle에서 키워드 분석
  const title = aiRecommendation.recipeTitle?.toLowerCase() || '';
  
  // 키워드 매핑 (우선순위 순서)
  const keywordMapping = [
    // 탄력/안티에이징
    { keywords: ['탄력', 'elasticity', '안티에이징', 'anti-aging', '주름', 'wrinkle', '리프팅'], type: 'elasticity' },
    
    // 유분조절/지성
    { keywords: ['보송', '유분', 'oil', '지성', 'oily', '기름', '피지', 'sebum'], type: 'oily' },
    
    // 진정/트러블  
    { keywords: ['진정', 'soothing', '트러블', 'trouble', '여드름', 'acne', '염증', 'inflammation'], type: 'acne' },
    
    // 민감성
    { keywords: ['민감', 'sensitive', '예민', '자극', 'irritation'], type: 'sensitive' },
    
    // 브라이트닝
    { keywords: ['브라이트', 'bright', '톤', 'tone', '화이트', 'white', '미백', 'whitening'], type: 'brightening' },
    
    // 보호/배리어
    { keywords: ['보호', 'protection', '배리어', 'barrier', '장벽', '강화'], type: 'barrier' },
    
    // 집중 보습
    { keywords: ['보습보습', '집중보습', 'intensive', '깊은', 'deep'], type: 'intensive_hydration' },
    
    // 산뜻 보습  
    { keywords: ['산뜻', 'fresh', '가벼운', 'light', '겔', 'gel'], type: 'light_hydration' },
    
    // 기본 보습
    { keywords: ['보습', 'moisture', '수분', 'hydration', '촉촉'], type: 'hydration' }
  ];

  // 2. 성분에서도 키워드 분석
  const ingredients = aiRecommendation.ingredients?.map((ing: any) => ing.name?.toLowerCase()).join(' ') || '';
  const summary = aiRecommendation.summary?.toLowerCase() || '';
  
  const fullText = `${title} ${ingredients} ${summary}`;

  // 3. 키워드 매칭 (첫 번째 매치되는 항목 반환)
  for (const mapping of keywordMapping) {
    if (mapping.keywords.some(keyword => fullText.includes(keyword))) {
      console.log(`🎯 AI 분석 결과: "${mapping.keywords.find(k => fullText.includes(k))}" → ${mapping.type}`);
      return mapping.type;
    }
  }

  // 4. 기본값 (매칭되는 키워드가 없는 경우)
  console.log('⚠️ 키워드 매칭 실패, 기본 보습 타입 적용');
  return 'hydration';
}

// 설문 답변 기반 피부 타입 분석 (백업용)
export function analyzeSkinTypeFromSurvey(answers: any): string {
  const skinType = answers.skin_type?.toLowerCase();
  
  const surveyMapping = {
    'dry': 'hydration',
    'oily': 'oily', 
    'sensitive': 'sensitive',
    'combination': 'light_hydration',
    'normal': 'hydration',
    'acne': 'acne'
  };

  return (surveyMapping as any)[skinType] || 'hydration';
}

// 메인 함수: AI 결과 또는 설문 답변으로 피부 타입 결정
export function determineSkinType(aiRecommendation: any, surveyAnswers?: any): string {
  // 1차: AI 추천 결과 분석
  if (aiRecommendation) {
    const aiResult = analyzeSkinTypeFromAI(aiRecommendation);
    console.log('🤖 AI 기반 피부 타입 결정:', aiResult);
    return aiResult;
  }
  
  // 2차: 설문 답변 기반 분석
  if (surveyAnswers) {
    const surveyResult = analyzeSkinTypeFromSurvey(surveyAnswers);
    console.log('📝 설문 기반 피부 타입 결정:', surveyResult);
    return surveyResult;
  }
  
  // 기본값
  console.log('🔄 기본 피부 타입 적용');
  return 'hydration';
}

// 피부 타입 디자인 컴포넌트 가져오기
export function getSkinTypeDesign(skinType: string): SkinTypeDesign {
  return skinTypeDesigns[skinType] || skinTypeDesigns['hydration'];
}

// 사용 예시:
// const skinType = determineSkinType(aiRecommendation, surveyAnswers);
// const design = getSkinTypeDesign(skinType);
// const Component = design.component;