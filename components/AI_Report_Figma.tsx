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
    amount: string;
    description?: string;
  }>;
  manufacturingSteps: string[];
  summary: string;
  precautions: string;
}

interface AIReportFigmaProps {
  userName: string;
  skinType: string;
  aiRecommendation: AIRecommendation;
  onBack: () => void;
  onShare?: () => void;
  surveyId?: string; // 개인화된 공유를 위한 surveyId
}

export function AI_Report_Figma({ 
  userName, 
  skinType, 
  aiRecommendation, 
  onBack, 
  onShare,
  surveyId 
}: AIReportFigmaProps) {
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  // AI 추천 결과 기반으로 동적 피부 타입 및 디자인 결정
  const dynamicSkinType = useMemo(() => {
    return determineSkinType(aiRecommendation, { skin_type: skinType });
  }, [aiRecommendation, skinType]);

  const skinTypeDesign = useMemo(() => {
    return getSkinTypeDesign(dynamicSkinType);
  }, [dynamicSkinType]);

  console.log('🎨 선택된 피부 타입 디자인:', {
    originalSkinType: skinType,
    determinedType: dynamicSkinType,
    designTitle: skinTypeDesign.title,
    backgroundColor: skinTypeDesign.backgroundColor
  });

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
    if (onShare) onShare();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* 반응형 스케일링 컨테이너 */}
        <div className="w-full flex justify-center p-2 md:p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white relative shadow-2xl w-full max-w-[900px]"
          >
            {/* 헤더 영역 - 고정 네비게이션 */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-3 md:p-4 flex items-center justify-between">
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

            {/* 메인 콘텐츠 - 반응형 Figma 디자인 */}
            <div className="pt-16 md:pt-20 pb-8 md:pb-12 relative w-full">
              {/* 동적 헤더 카드 - AI 분석 결과에 따라 디자인 변경 */}
              <div className="mx-4 md:mx-[59px] mt-4 md:mt-[60px] relative">
                <div className="w-full max-w-[min(90vw,782px)] mx-auto">
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
                
                {/* 성분 그리드 - 반응형 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mx-4 md:mx-[59px] mb-4 md:mb-6">
                  {[
                    { name: aiRecommendation.ingredients[0]?.name || '병풀 추출물', amount: aiRecommendation.ingredients[0]?.amount || '5g' },
                    { name: aiRecommendation.ingredients[1]?.name || '동백오일', amount: aiRecommendation.ingredients[1]?.amount || '5g' },
                    { name: aiRecommendation.ingredients[2]?.name || '동백오일', amount: aiRecommendation.ingredients[2]?.amount || '5g' },
                    { name: aiRecommendation.ingredients[3]?.name || '동백오일', amount: aiRecommendation.ingredients[3]?.amount || '5g' },
                    { name: aiRecommendation.ingredients[4]?.name || '알로에 젤', amount: aiRecommendation.ingredients[4]?.amount || '5g' },
                    { name: aiRecommendation.ingredients[5]?.name || '올리브리퀴드', amount: aiRecommendation.ingredients[5]?.amount || '5g' },
                  ].map((ingredient, index) => (
                    <motion.div
                      key={index}
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
                    </motion.div>
                  ))}
                </div>

                {/* 원료 설명 더보기 버튼 */}
                <div className="text-center">
                  <button
                    onClick={() => setShowIngredientModal(true)}
                    className="font-['Pretendard',sans-serif] font-semibold text-[#666666] text-base md:text-xl lg:text-[30px] hover:text-[#102a71] transition-colors tracking-tight"
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
                        <div className="bg-[#102a71] text-white rounded-full w-10 h-10 md:w-16 md:h-16 flex items-center justify-center font-semibold text-sm md:text-xl lg:text-[40px] flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-['Pretendard',sans-serif] font-semibold text-[#102a71] text-lg md:text-2xl lg:text-[40px] mb-2 md:mb-4 tracking-tight">
                            {index + 1}단계
                          </h3>
                          <p className="font-['Pretendard',sans-serif] font-semibold text-[#4f3d93] text-sm md:text-lg lg:text-[32px] leading-relaxed tracking-tight">
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
                
                <div className="bg-neutral-100 rounded-lg md:rounded-[24px] p-4 md:p-8 mx-4 md:mx-[60px]">
                  <p className="font-['Pretendard',sans-serif] font-semibold text-[#4f3d93] text-sm md:text-lg lg:text-[32px] leading-relaxed tracking-tight whitespace-pre-line">
                    {aiRecommendation.summary}
                  </p>
                </div>
              </div>

              {/* 주의사항 섹션 */}
              <div className="mb-12 md:mb-16">
                <h2 className="font-['Pretendard',sans-serif] font-semibold text-black text-2xl md:text-4xl lg:text-[50px] text-center mb-6 md:mb-8 tracking-tight">
                  주의사항 및 보관안내
                </h2>
                
                <div className="bg-neutral-100 rounded-lg md:rounded-[24px] p-4 md:p-8 mx-4 md:mx-[60px]">
                  <div className="font-['Pretendard',sans-serif] text-[#4f3d93] text-sm md:text-lg lg:text-[32px] leading-relaxed tracking-tight space-y-2 md:space-y-4">
                    <p>
                      화장품 사용 시 또는 사용 후 직사광선에 의하여 사용부위가 붉은 반점, 부어오름 또는 가려움증 등의 이상 증상이나 부작용이 있는 경우 전문의 등과 상담할 것 상처가 있는 부위 등에는 사용을 자제할 것
                    </p>
                    
                    <div>
                      <p className="font-semibold mb-1 md:mb-2">보관 및 취급 시의 주의사항</p>
                      <p>가) 어린이의 손이 닿지 않는 곳에 보관할 것</p>
                      <p>나) 직사광선을 피해서 보관할 것</p>
                    </div>
                    
                    {aiRecommendation.precautions && (
                      <p className="border-t pt-2 md:pt-4 mt-2 md:mt-4">
                        {aiRecommendation.precautions}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 성분 상세보기 모달 - 반응형 */}
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

              {/* 성분 리스트 */}
              <div className="space-y-4 md:space-y-6 mb-6">
                {[
                  { name: '알로에 젤', description: '피부에 시원한 수분을 공급하고 진정 효과를 선사하는 순한 베이스' },
                  { name: '글리세린', description: '공기 중 수분을 끌어당겨 피부를 촉촉하게 유지해주는 보습 성분' },
                  { name: '호호바오일', description: '피부 장벽을 보호하며 가벼운 보습막을 형성하는 순한 오일' },
                  { name: '동백오일', description: '피부를 부드럽게 가꿔주는 가벼운 텍스처의 오일' },
                  { name: '어성초추출물', description: '피부를 맑고 깨끗하게 가꿔주는 진정 성분' },
                  { name: '병풀추출물', description: '예민한 피부를 편안하게 달래주는 진정 추출물' },
                  { name: '티트리 아로마 오일', description: '피부를 청결하게 가꾸고 진정 효과를 주는 천연 에센셜 오일' },
                  { name: '라벤더 아로마 오일', description: '피부를 편안하게 진정시키고 릴렉싱 효과를 선사하는 아로마 오일' }
                ].map((ingredient, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-3 md:pb-4 last:pb-0">
                    <h4 className="font-['Pretendard',sans-serif] font-semibold text-black text-base md:text-lg lg:text-[30px] mb-1 md:mb-2 tracking-tight">
                      {ingredient.name}
                    </h4>
                    <p className="font-['Pretendard',sans-serif] font-normal text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
                      {ingredient.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* 모달 푸터 */}
              <div className="text-center space-y-4">
                <p className="font-['Pretendard',sans-serif] text-[#b3b3b3] text-xs md:text-sm lg:text-[30px] tracking-tight">
                  *원료적 설명에 한함
                </p>
                <button
                  onClick={() => setShowIngredientModal(false)}
                  className="bg-[#102a71] hover:bg-[#102a71]/90 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-[16px] font-['Pretendard',sans-serif] font-semibold text-sm md:text-base lg:text-[30px] tracking-tight transition-colors"
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
