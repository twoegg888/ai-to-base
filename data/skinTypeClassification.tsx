// AI To BASE 앱의 새로운 피부 타입 분류 시스템

export const SKIN_TYPE_MAPPING = {
  // 기존 → 새로운 타입명
  "수분 지킴이 타입": "수분 부족 타입",
  "탄력 메이커 타입": "탄력 부족 타입", 
  "유분 밸런서 타입": "유분 과다 타입",
  "진정 힐러 타입": "자극 민감 타입",
  "민감 케어러 타입": "예민 반응 타입",
  "브라이트 업 타입": "톤 개선 타입",
  "보호 방패 타입": "보호 필요 타입",
  "부드러운 보습러버 타입": "깊은 보습 타입",
  "산뜻 쿨링러 타입": "가벼운 보습 타입",
  "오일 프리러 타입": "산뜻 선호 타입"
};

export const NEW_SKIN_TYPES = [
  {
    id: "moisture_deficient",
    name: "수분 부족 타입",
    description: "피부 수분이 부족하여 건조함과 당김이 느껴지는 타입",
    characteristics: ["건조함", "당김", "각질", "거칠음"],
    mainConcern: "수분 공급",
    recommendedIngredients: ["히알루론산", "글리세린", "세라마이드", "알로에"],
    avoidIngredients: ["알코올", "강한 계면활성제"]
  },
  {
    id: "elasticity_deficient", 
    name: "탄력 부족 타입",
    description: "피부 탄력이 떨어져 처짐과 주름이 고민인 타입",
    characteristics: ["탄력 저하", "주름", "처짐", "모공 확장"],
    mainConcern: "탄력 개선",
    recommendedIngredients: ["콜라겐", "펩타이드", "레티놀", "비타민C"],
    avoidIngredients: ["과도한 필링", "알코올"]
  },
  {
    id: "excess_oil",
    name: "유분 과다 타입", 
    description: "피지 분비가 많아 번들거림과 여드름이 고민인 타입",
    characteristics: ["과도한 유분", "번들거림", "모공 확장", "여드름"],
    mainConcern: "유분 조절",
    recommendedIngredients: ["살리실산", "나이아신아마이드", "티트리", "클레이"],
    avoidIngredients: ["heavy oil", "과도한 보습제"]
  },
  {
    id: "irritation_sensitive",
    name: "자극 민감 타입",
    description: "외부 자극에 쉽게 반응하여 빨갛게 되거나 따가운 타입", 
    characteristics: ["쉬운 자극", "홍조", "따가움", "가려움"],
    mainConcern: "진정 및 보호",
    recommendedIngredients: ["센텔라", "알로에", "감초추출물", "판테놀"],
    avoidIngredients: ["향료", "알코올", "강한 산성 성분"]
  },
  {
    id: "sensitive_reactive",
    name: "예민 반응 타입",
    description: "화장품이나 환경 변화에 예민하게 반응하는 타입",
    characteristics: ["화장품 불내성", "환경 민감", "트러블", "알레르기"],
    mainConcern: "순한 관리",
    recommendedIngredients: ["마데카소사이드", "알란토인", "오트밀", "카모마일"],
    avoidIngredients: ["향료", "방부제", "색소", "에센셜 오일"]
  },
  {
    id: "tone_improvement",
    name: "톤 개선 타입",
    description: "피부톤이 어둡거나 불균일하여 브라이트닝이 필요한 타입",
    characteristics: ["어두운 톤", "색소침착", "불균일", "칙칙함"], 
    mainConcern: "톤 개선",
    recommendedIngredients: ["비타민C", "알부틴", "코직산", "감초추출물"],
    avoidIngredients: ["과도한 필링", "자극적 미백 성분"]
  },
  {
    id: "protection_needed",
    name: "보호 필요 타입",
    description: "외부 환경으로부터 피부 보호가 중요한 타입",
    characteristics: ["환경 노출", "장벽 약화", "수분 손실", "외부 스트레스"],
    mainConcern: "피부 장벽 강화",
    recommendedIngredients: ["세라마이드", "스쿠알란", "시어버터", "콜레스테롤"],
    avoidIngredients: ["과도한 클렌징", "강한 필링"]
  },
  {
    id: "deep_moisturizing",
    name: "깊은 보습 타입",
    description: "표면뿐 아니라 깊은 수분 공급이 필요한 타입", 
    characteristics: ["깊은 건조", "수분 부족", "거친 텍스처", "각질"],
    mainConcern: "깊은 수분 공급",
    recommendedIngredients: ["저분자 히알루론산", "글리세린", "우레아", "PCA나트륨"],
    avoidIngredients: ["알코올", "강한 계면활성제"]
  },
  {
    id: "light_moisturizing", 
    name: "가벼운 보습 타입",
    description: "끈적임 없는 가벼운 보습이 적합한 타입",
    characteristics: ["끈적임 싫어함", "가벼운 제형 선호", "복합성", "더운 기후"],
    mainConcern: "가벼운 수분 공급", 
    recommendedIngredients: ["알로에젤", "히알루론산", "글리세린", "베타글루칸"],
    avoidIngredients: ["heavy cream", "오일리 성분"]
  },
  {
    id: "fresh_preference",
    name: "산뜻 선호 타입",
    description: "산뜻하고 깔끔한 마무리감을 선호하는 타입",
    characteristics: ["산뜻함 선호", "끈적임 비선호", "깔끔한 마무리", "오일 프리"],
    mainConcern: "산뜻한 마무리",
    recommendedIngredients: ["나이아신아마이드", "물 기반 성분", "가벼운 보습제"],
    avoidIngredients: ["heavy oil", "왁스 성분", "끈적한 성분"]
  }
];

// 타입별 추천 제품 타입
export const PRODUCT_TYPE_BY_SKIN_TYPE = {
  "수분 부족 타입": ["수분크림", "수분세럼", "수분마스크"],
  "탄력 부족 타입": ["안티에이징크림", "펩타이드세럼", "리프팅마스크"], 
  "유분 과다 타입": ["세범조절크림", "BHA세럼", "클레이마스크"],
  "자극 민감 타입": ["진정크림", "센텔라세럼", "진정마스크"],
  "예민 반응 타입": ["순한크림", "저자극세럼", "진정마스크"],
  "톤 개선 타입": ["브라이트닝크림", "비타민C세럼", "미백마스크"],
  "보호 필요 타입": ["배리어크림", "보호세럼", "강화마스크"],
  "깊은 보습 타입": ["딥모이스처크림", "히알루론산세럼", "보습마스크"],
  "가벼운 보습 타입": ["젤크림", "가벼운세럼", "하이드로겔마스크"],
  "산뜻 선호 타입": ["젤크림", "워터리세럼", "쿨링마스크"]
};

// 사용자의 설문 답변에 따른 타입 결정 로직 (예시)
export function determineSkinType(answers: any): string {
  // 설문 답변 분석하여 가장 적합한 타입 반환
  // 실제 구현은 설문 로직에 따라 달라짐
  
  // 예시 로직
  if (answers.skin_concerns?.includes("건조") || answers.skin_concerns?.includes("당김")) {
    return "수분 부족 타입";
  }
  
  if (answers.skin_concerns?.includes("민감") || answers.skin_concerns?.includes("자극")) {
    return "자극 민감 타입";
  }
  
  if (answers.skin_concerns?.includes("유분") || answers.skin_concerns?.includes("번들거림")) {
    return "유분 과다 타입";
  }
  
  // 기본값
  return "수분 부족 타입";
}

export default {
  SKIN_TYPE_MAPPING,
  NEW_SKIN_TYPES, 
  PRODUCT_TYPE_BY_SKIN_TYPE,
  determineSkinType
};