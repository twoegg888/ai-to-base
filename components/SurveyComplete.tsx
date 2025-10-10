import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

import { SurveyAnswers } from '../data/surveyQuestions';
import { waitForAIRecommendation } from '../utils/supabase/survey';
import { determineSkinType, getSkinTypeDesign } from '../utils/skinTypeMapping';

interface SurveyCompleteProps {
  userName: string;
  answers: SurveyAnswers;
  onRestart: () => void;
  surveyId?: string;
  onShowAIReport?: (recommendation: any) => void;
}

export function SurveyComplete({ userName, answers, onRestart, surveyId, onShowAIReport }: SurveyCompleteProps) {
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  const [aiResult, setAiResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const steps = [
    { text: '설문 데이터를 분석하고 있어요', duration: 3000 },
    { text: '피부 타입과 선호도를 검토하고 있어요', duration: 3500 },
    { text: '맞춤형 레시피를 생성하고 있어요', duration: 4000 },
    { text: '최적의 원료 조합을 계산하고 있어요', duration: 3500 },
    { text: '거의 완성되었어요', duration: 2000 }
  ];

  useEffect(() => {
    // 초기 완료 메시지 표시 (2초)
    const timer1 = setTimeout(() => {
      setShowInitialMessage(false);
      startProcessing();
    }, 2000);

    return () => clearTimeout(timer1);
  }, []);

  const startProcessing = async () => {
    let totalProgress = 0;
    const progressPerStep = 80 / steps.length; // 80%까지는 단계별 진행

    // 단계별 진행
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // 프로그레스 바 증가
      const targetProgress = (i + 1) * progressPerStep;
      const startProgress = totalProgress;
      const duration = steps[i].duration;
      const increment = (targetProgress - startProgress) / (duration / 50);
      
      const progressInterval = setInterval(() => {
        totalProgress += increment;
        if (totalProgress >= targetProgress) {
          totalProgress = targetProgress;
          clearInterval(progressInterval);
        }
        setLoadingProgress(Math.min(totalProgress, 80));
      }, 50);

      await new Promise(resolve => setTimeout(resolve, duration));
      clearInterval(progressInterval);
    }

    // 실제 AI 결과 대기
    try {
      if (surveyId) {
        const result = await waitForAIRecommendation(surveyId, 15);
        
        // 마지막 20% 진행
        setLoadingProgress(100);
        
        if (result.success && result.data?.recommendation) {
          try {
            // JSON 형식인지 먼저 확인
            let recommendation;
            const rawData = result.data.recommendation;
            
            if (typeof rawData === 'string' && rawData.trim().startsWith('{')) {
              // JSON 형식으로 파싱 시도
              recommendation = JSON.parse(rawData);
            } else if (typeof rawData === 'string') {
              // 마크다운 형식일 경우 텍스트 그대로 처리
              console.log('📝 마크다운 형식의 AI 결과 감지:', rawData.substring(0, 100) + '...');
              recommendation = {
                isMarkdown: true,
                content: rawData,
                summary: '맞춤형 화장품 레시피가 생성되었습니다.'
              };
            } else {
              // 이미 객체 형태인 경우
              recommendation = rawData;
            }
            
            setAiResult(recommendation);
          } catch (parseError) {
            console.error('AI 추천 데이터 파싱 오류:', parseError);
            console.log('문제가 된 데이터:', result.data.recommendation);
            
            // 파싱 실패 시에도 원본 텍스트로 처리
            setAiResult({
              isMarkdown: true,
              content: result.data.recommendation,
              summary: '레시피가 생성되었지만 형식 처리 중 문제가 발생했습니다.',
              error: false // 에러가 아닌 대안 처리
            });
          }
        } else {
          setAiResult({
            error: true,
            message: '레시피 생성에 실패했습니다. 다시 시도해주세요.'
          });
        }
      } else {
        setAiResult({
          error: true,
          message: '설문 ID를 찾을 수 없습니다.'
        });
      }
    } catch (error) {
      console.error('AI 결과 대기 중 오류:', error);
      setAiResult({
        error: true,
        message: '처리 중 오류가 발생했습니다.'
      });
    }
  };

  // AI 결과가 있으면 보고서 화면으로 이동
  if (aiResult && !aiResult.error) {
    // 더미 데이터 생성 (실제로는 Make.com에서 받은 데이터 사용)
    // AI 결과가 실제로 있다면 그것을 사용하고, 없다면 설문 답변 기반으로 생성
    const determinedSkinType = determineSkinType(aiResult, answers);
    const skinTypeDesign = getSkinTypeDesign(determinedSkinType);
    
    console.log('🎯 SurveyComplete - 결정된 피부 타입:', {
      determinedSkinType,
      designTitle: skinTypeDesign.title
    });

    const mockRecommendation = {
      recipeTitle: skinTypeDesign.title,
      ingredients: [
        { name: '병풀 추출물', amount: '5g', description: '예민한 피부를 편안하게 달래주는 진정 추출물입니다. 염증을 가라앉히고 피부 재생을 도와줍니다.' },
        { name: '동백오일', amount: '5g', description: '피부를 부드럽게 가꿔주는 가벼운 텍스처의 오일입니다. 보습과 영양 공급에 탁월합니다.' },
        { name: '알로에 젤', amount: '5g', description: '피부에 시원한 수분을 공급하고 진정 효과를 선사하는 순한 베이스 성분입니다.' },
        { name: '글리세린', amount: '3g', description: '공기 중 수분을 끌어당겨 피부를 촉촉하게 유지해주는 천연 보습 성분입니다.' },
        { name: '호호바오일', amount: '2g', description: '피부 장벽을 보호하며 가벼운 보습막을 형성하는 순한 오일로, 모든 피부 타입에 적합합니다.' },
        { name: '올리브리퀴드', amount: '5g', description: '비타민 E가 풍부한 천연 오일로 피부에 깊은 영양을 공급하고 탄력을 개선합니다.' }
      ],
      manufacturingSteps: [
        '깨끗하게 소독된 용기에 알로에 젤과 글리세린을 넣고 나무 스패츌라로 충분히 섞어주세요. 기포가 생기지 않도록 천천히 저어주는 것이 중요합니다.',
        '별도의 용기에 오일 성분들(동백오일, 호호바오일, 올리브리퀴드)을 차례로 넣고 균일하게 섞어주세요. 오일들이 완전히 융합될 때까지 충분히 저어주세요.',
        '베이스 혼합물에 오일 블렌드를 조금씩 넣으면서 유화가 잘 되도록 지속적으로 저어주세요. 마지막으로 병풀 추출물을 넣고 2-3분간 더 저어서 완성해주세요.'
      ],
      summary: `${userName}님의 설문 결과를 바탕으로 제작된 맞춤형 ${skinTypeDesign.title} 레시피입니다. \n\n${skinTypeDesign.description}에 특화된 이 레시피는, 천연 성분만을 사용하여 피부에 부담 없이 사용할 수 있습니다. \n\n매일 아침·저녁 세안 후 적당량을 발라 부드럽게 마사지하시면, 건강하고 촉촉한 피부를 유지할 수 있습니다. 특히 건조한 환절기나 실내 난방으로 인한 피부 트러블 예방에 효과적입니다.`,
      precautions: `개인의 피부 상태와 알레르기 반응은 개인차가 있을 수 있습니다. 처음 사용하실 때는 팔 안쪽 등에 소량을 발라 24시간 후 이상 반응이 없는지 확인 후 사용해주세요.`
    };

    if (onShowAIReport) {
      setTimeout(() => {
        onShowAIReport(mockRecommendation);
      }, 500);
      
      return (
        <div className="bg-white relative size-full flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-2xl text-[#102A71] mb-4">
              레시피가 완성되었어요! 🎉
            </h2>
            <p className="text-gray-600">
              AI 맞춤 보고서를 확인해보세요
            </p>
          </motion.div>
        </div>
      );
    }
  }

  // AI 결과에 오류가 있는 경우
  if (aiResult && aiResult.error) {
    return (
      <div className="bg-white relative size-full flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 6v4M10 14h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-xl text-gray-900 mb-3">
            처리 중 문제가 발생했어요
          </h2>
          <p className="text-gray-600 mb-6">
            {aiResult.message || '다시 시도해주세요'}
          </p>
          <button
            onClick={onRestart}
            className="bg-[#102A71] text-white px-6 py-3 rounded-lg hover:bg-[#102A71]/90 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  // 초기 완료 메시지 (토스 스타일)
  if (showInitialMessage) {
    return (
      <div className="bg-white relative size-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center max-w-sm"
        >
          {/* 토스 스타일 체크 아이콘 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-12 h-12 bg-[#102A71] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M6 10l3 3 5-6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h2 className="text-xl text-gray-900 mb-3">
              설문이 완료되었어요
            </h2>
            
            <p className="text-gray-600">
              {userName}님의 답변을 바탕으로<br />
              맞춤 레시피를 준비하고 있어요
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // 처리 중 화면 (토스 스타일)
  return (
    <div className="bg-white relative size-full flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-sm w-full"
      >
        {/* 토스 스타일 심플 로딩 */}
        <div className="w-10 h-10 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-full h-full border-2 border-gray-200 border-t-[#102A71] rounded-full"
          />
        </div>
        
        {/* 현재 단계 메시지 */}
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-lg text-gray-900 mb-2"
        >
          {steps[currentStep]?.text || '처리 중이에요'}
        </motion.h2>
        
        <p className="text-sm text-gray-500 mb-8">
          잠시만 기다려주세요
        </p>

        {/* 토스 스타일 심플 프로그레스 바 */}
        <div className="w-full bg-gray-100 rounded-full h-1 mb-3">
          <motion.div 
            className="bg-[#102A71] h-1 rounded-full"
            style={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
        
        {/* 프로그레스 퍼센트 */}
        <p className="text-xs text-gray-400">
          {Math.round(loadingProgress)}%
        </p>
      </motion.div>
    </div>
  );
}