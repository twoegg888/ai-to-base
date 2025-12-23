import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { toast } from "sonner";
import { projectId } from '../utils/supabase/info';
import { determineSkinType, getSkinTypeDesign } from '../utils/skinTypeMapping';

interface AIRecommendation {
  recipeTitle: string;
  ingredients: Array<{
    name: string;
    amount: string; // 예: "94g (94%)"
    description?: string;
    // ✅ 백엔드에서 나중에 percent를 따로 주면 여기 추가 가능:
    // percent?: number;
  }>;
  manufacturingSteps: string[];
  summary: string;
}

interface RecipeCardProps {
  userName: string;
  skinType: string;
  aiRecommendation: AIRecommendation;
  surveyId?: string;
  onBack: () => void;
  onShare?: () => void;
}

export default function RecipeCard({
  userName,
  skinType,
  aiRecommendation,
  surveyId,
  onBack,
  onShare
}: RecipeCardProps) {
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  // ✅ (1) 피부타입 동적 결정
  const dynamicSkinType = useMemo(() => {
    const answers = { skin_type: skinType };
    const determined = determineSkinType(aiRecommendation, answers);
    console.log('원래 skinType:', skinType);
    console.log('결정된 skinType:', determined);
    return determined;
  }, [aiRecommendation, skinType]);

  // ✅ (2) 피부타입별 디자인 선택
  const skinTypeDesign = useMemo(() => {
    const design = getSkinTypeDesign(dynamicSkinType);
    console.log('skinTypeDesign:', design);
    return design;
  }, [dynamicSkinType]);

  // ---------------------------
  // ✅ 퍼센트 파싱 유틸 (예: "94g (94%)" -> 94)
  // ---------------------------
  const extractPercent = (amount?: string) => {
    if (!amount) return null;
    const m = amount.match(/\(([\d.]+)\s*%\)/);
    return m ? Number(m[1]) : null;
  };

  // ---------------------------
  // ✅ 아로마 2종 기본값 (프론트에서만 추가)
  //  - 백엔드에서 이미 내려오면 중복 방지 로직이 걸림
  //  - amount 값은 "표시용"이라, 원하면 0.2g (0.2%) 같은 형태로 조정 가능
  // ---------------------------
  const aromaDefaults = useMemo(() => ([
    { name: '라벤더 아로마 오일', amount: '0.2g (0.2%)', description: '편안한 향과 진정감을 주는 아로마 오일 (소량 사용 권장)' },
    { name: '티트리 아로마 오일', amount: '0.2g (0.2%)', description: '상쾌한 향과 피부 컨디션 케어에 쓰이는 아로마 오일 (소량 사용 권장)' },
  ]), []);

  // ---------------------------
  // ✅ 표시용 성분 리스트: (Supabase/Claude 결과) + (없으면 라벤더/티트리 추가)
  // ---------------------------
  const displayIngredients = useMemo(() => {
    const base = Array.isArray(aiRecommendation.ingredients) ? aiRecommendation.ingredients : [];

    const hasLavender = base.some(i => (i?.name ?? '').includes('라벤더'));
    const hasTeaTree = base.some(i => (i?.name ?? '').includes('티트리'));

    const merged = [
      ...base,
      ...(hasLavender ? [] : [aromaDefaults[0]]),
      ...(hasTeaTree ? [] : [aromaDefaults[1]]),
    ];

    // ✅ 최대 몇 개까지 보여줄지 (원하면 6으로 줄여도 됨)
    return merged.slice(0, 8);
  }, [aiRecommendation.ingredients, aromaDefaults]);

  // ---------------------------
  // ✅ 모달 설명용: AI가 description을 주면 우선 사용, 없으면 기본 맵으로 보완
  // ---------------------------
  const ingredientDescMap: Record<string, string> = useMemo(() => ({
    '알로에 젤': '피부에 시원한 수분을 공급하고 진정 효과를 선사하는 순한 베이스',
    '글리세린': '공기 중 수분을 끌어당겨 피부를 촉촉하게 유지해주는 보습 성분',
    '호호바오일': '피부 장벽을 보호하며 가벼운 보습막을 형성하는 순한 오일',
    '동백오일': '피부를 부드럽게 가꿔주는 가벼운 텍스처의 오일',
    '어성초추출물': '피부를 맑고 깨끗하게 가꿔주는 진정 성분',
    '병풀추출물': '예민한 피부를 편안하게 달래주는 진정 추출물',
    '라벤더 아로마 오일': '편안한 향과 진정감을 주는 아로마 오일 (소량 사용 권장)',
    '티트리 아로마 오일': '상쾌한 향과 피부 컨디션 케어에 쓰이는 아로마 오일 (소량 사용 권장)',
  }), []);

  const handleShare = async () => {
    // 개인화된 공유 링크 생성 (캐시 방지를 위한 타임스탬프 포함)
    const timestamp = Date.now();
    const personalizedShareUrl = surveyId
      ? `https://${projectId}.supabase.co/functions/v1/make-server-44d07f49/share/${surveyId}?v=${timestamp}`
      : window.location.href;

    const shareTitle = `${userName}님은 ${aiRecommendation.recipeTitle}가 필요해요!`;
    const shareText = `🧴 AI가 분석한 맞춤형 화장품 레시피를 확인해보세요!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: personalizedShareUrl,
        });
        toast.success('🎉 나만의 카드 이미지로 공유되었습니다! 📤');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('공유 중 오류가 발생했습니다.');
        }
      }
    } else {
      // Web Share API를 지원하지 않는 경우 링크 복사
      try {
        await navigator.clipboard.writeText(personalizedShareUrl);
        toast.success('📋 나만의 카드 이미지 링크가 복사되었습니다!');
      } catch (error) {
        toast.error('공유 기능을 지원하지 않는 브라우저입니다.');
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* 헤더 */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-14 md:h-16">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">뒤로가기</span>
              </button>
              {onShare && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-medium">공유하기</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="pt-14 md:pt-16">
          <div className="max-w-6xl mx-auto">
            {/* 상단 히어로 */}
            <div className="px-4 md:px-6 py-8 md:py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 md:mb-12"
              >
                <h1 className="font-['Pretendard',sans-serif] font-semibold text-black text-2xl md:text-4xl lg:text-[50px] tracking-tight mb-3 md:mb-4">
                  {userName}님의 맞춤 레시피
                </h1>
                <p className="font-['Pretendard',sans-serif] font-thin text-[#b3b3b3] text-sm md:text-lg lg:text-[30px] tracking-tight">
                  {aiRecommendation.recipeTitle}
                </p>
              </motion.div>

              {/* 피부 타입 카드 */}
              <div className="flex justify-center mb-10 md:mb-16">
                <div className="w-full max-w-md">
                  {React.createElement(skinTypeDesign.component, {
                    userName: userName
                  })}
                </div>
              </div>

              {/* 맞춤 레시피 섹션 */}
              <div className="mt-8 md:mt-16 mb-8 md:mb-12">
                <h2 className="font-['Pretendard',sans-serif] font-semibold text-black text-2xl md:text-4xl lg:text-[50px] text-center mb-6 md:mb-8 tracking-tight">
                  {userName}님 맞춤 레시피
                </h2>

                {/* ✅ 성분 그리드 - 동적 렌더링 + 퍼센트 바 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mx-4 md:mx-[59px] mb-4 md:mb-6">
                  {displayIngredients.map((ingredient, index) => {
                    // 나중에 백엔드에서 percent를 따로 주면 여기에서 우선순위로 사용 가능:
                    // const percent = typeof ingredient.percent === 'number' ? ingredient.percent : extractPercent(ingredient.amount);
                    const percent = extractPercent(ingredient.amount);

                    return (
                      <motion.div
                        key={`${ingredient.name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                        className="bg-neutral-100 rounded-lg md:rounded-[24px] p-4 md:p-8 text-center hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setShowIngredientModal(true)}
                      >
                        <h3 className="font-['Pretendard',sans-serif] font-semibold text-[#102a71] text-lg md:text-2xl lg:text-[35px] mb-2 md:mb-4 tracking-tight">
                          {ingredient.name}
                        </h3>

                        <p className="font-['Pretendard',sans-serif] font-thin text-[#102a71] text-2xl md:text-4xl lg:text-[60px] tracking-tight">
                          {ingredient.amount}
                        </p>

                        {/* ✅ 반응형 퍼센트 표시 */}
                        {typeof percent === 'number' && (
                          <div className="mt-3 md:mt-4">
                            <div className="h-2 md:h-3 bg-white/60 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#102a71] rounded-full transition-all"
                                style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
                              />
                            </div>
                            <div className="mt-1 text-xs md:text-sm text-[#102a71]/70">
                              {percent}%
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* 원료 설명 더보기 버튼 */}
                <div className="text-center">
                  <button
                    onClick={() => setShowIngredientModal(true)}
                    className="font-['Pretendard',sans-serif] font-thin text-[#b3b3b3] text-sm md:text-base lg:text-[30px] hover:text-[#102a71] transition-colors tracking-tight"
                  >
                    *원료 설명 더보기
                  </button>
                </div>
              </div>

              {/* 제조방법 섹션 */}
              <div className="mb-8 md:mb-12">
                <h2 className="font-['Pretendard',sans-serif] font-semibold text-black text-2xl md:text-4xl lg:text-[50px] text-center mb-6 md:mb-8 tracking-tight">
                  제조방법
                </h2>

                <div className="space-y-4 md:space-y-6 mx-4 md:mx-[60px]">
                  {aiRecommendation.manufacturingSteps.slice(0, 3).map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.2, duration: 0.4 }}
                      className="bg-neutral-100 rounded-lg md:rounded-[24px] p-4 md:p-8"
                    >
                      <div className="flex items-start gap-3 md:gap-6">
                        <div className="bg-[#102a71] text-white rounded-full w-7 h-7 md:w-12 md:h-12 flex items-center justify-center font-semibold text-sm md:text-xl lg:text-[40px] flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-['Pretendard',sans-serif] font-semibold text-black text-lg md:text-2xl lg:text-[40px] mb-2 md:mb-4 tracking-tight">
                            {index + 1}단계
                          </h3>
                          <p className="font-['Pretendard',sans-serif] font-thin text-black text-sm md:text-lg lg:text-[30px] leading-relaxed tracking-tight">
                            {step}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 총평 섹션 */}
              <div className="mb-8 md:mb-12">
                <h2 className="font-['Pretendard',sans-serif] font-semibold text-black text-2xl md:text-4xl lg:text-[50px] text-center mb-6 md:mb-8 tracking-tight">
                  총평
                </h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  className="bg-neutral-100 rounded-lg md:rounded-[24px] p-4 md:p-8 mx-4 md:mx-[60px]"
                >
                  <p className="font-['Pretendard',sans-serif] font-thin text-black text-sm md:text-lg lg:text-[30px] leading-relaxed tracking-tight text-center">
                    {aiRecommendation.summary}
                  </p>
                </motion.div>
              </div>

              {/* 주의사항 및 보관 안내 */}
              <div className="pb-12 md:pb-20">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                  className="text-center space-y-3 md:space-y-4"
                >
                  <p className="font-['Pretendard',sans-serif] font-thin text-[#b3b3b3] text-xs md:text-sm lg:text-[30px] tracking-tight">
                    *본 레시피는 개인 맞춤형 추천이며, 피부 자극이 있을 경우 사용을 중단해주세요.
                  </p>
                  <p className="font-['Pretendard',sans-serif] font-thin text-[#b3b3b3] text-xs md:text-sm lg:text-[30px] tracking-tight">
                    *제조 후 1년 이내 사용을 권장하며, 직사광선을 피해 보관해주세요.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 성분 상세보기 모달 - displayIngredients 기반 */}
      <AnimatePresence>
        {showIngredientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={() => setShowIngredientModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg md:rounded-[24px] p-4 md:p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Pretendard',sans-serif] font-semibold text-black text-lg md:text-2xl tracking-tight">
                  성분 상세 정보
                </h3>
                <button
                  onClick={() => setShowIngredientModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>

              {/* ✅ 성분 리스트 (동적) */}
              <div className="space-y-4 md:space-y-6 mb-6">
                {displayIngredients.map((ingredient, index) => {
                  const desc =
                    ingredient.description ||
                    ingredientDescMap[ingredient.name] ||
                    '해당 원료에 대한 설명이 준비 중입니다.';

                  return (
                    <div key={`${ingredient.name}-${index}`} className="border-b border-gray-100 last:border-0 pb-3 md:pb-4 last:pb-0">
                      <h4 className="font-['Pretendard',sans-serif] font-semibold text-black text-base md:text-lg lg:text-[30px] mb-1 md:mb-2 tracking-tight">
                        {ingredient.name}
                      </h4>
                      <p className="font-['Pretendard',sans-serif] text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 모달 푸터 */}
              <div className="text-center space-y-4">
                <p className="font-['Pretendard',sans-serif] text-[#b3b3b3] text-xs md:text-sm lg:text-[30px] tracking-tight">
                  *원료적 설명에 한함
                </p>
                <button
                  onClick={() => setShowIngredientModal(false)}
                  className="bg-[#102a71] hover:bg-[#102a71]/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg md:rounded-[24px] font-['Pretendard',sans-serif] font-semibold text-sm md:text-base lg:text-[30px] tracking-tight transition-colors"
                >
                  뒤로가기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
