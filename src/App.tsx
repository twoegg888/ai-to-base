import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StartScreen } from '../components/StartScreen';
import { IntroScreen } from '../components/IntroScreen';
import { GuideScreen } from '../components/GuideScreen';
import { UserInfoForm } from '../components/UserInfoForm';
import { ReportResult } from '../components/ReportResult';

import { Part1Intro } from '../components/Part1Intro';
import { Part2Intro } from '../components/Part2Intro';
import { Part3Intro } from '../components/Part3Intro';
import { Part4Intro } from '../components/Part4Intro';
import { Part5Intro } from '../components/Part5Intro';
import { Part6Intro } from '../components/Part6Intro';
import { Part7Intro } from '../components/Part7Intro';
import { SurveyFlow } from '../components/SurveyFlow';
import { SurveyComplete } from '../components/SurveyComplete';

import { ErrorBoundary } from '../components/ErrorBoundary';
import { AI_Report_Figma } from '../components/AI_Report_Figma';
// Lazy load heavy components
const SkinTypePreview = React.lazy(() => import('../components/SkinTypePreview').then(module => ({ default: module.SkinTypePreview })));
import { Toaster } from "../components/ui/sonner";
import { createSurvey, updateSurvey } from '../utils/supabase/survey';
import { updateDatabaseSchema } from '../utils/supabase/schema';
import { SurveyAnswers } from '../data/surveyQuestions';

type Screen = 'start' | 'intro' | 'guide' | 'userInfo' | 'result' | 
             'part1' | 'part1Questions' | 
             'part2' | 'part2Questions' | 
             'part3' | 'part3Questions' | 
             'part4' | 'part4Questions' | 
             'part5' | 'part5Questions' | 
             'part6' | 'part6Questions' | 
             'part7' | 'part7Questions' | 
             'surveyComplete' | 'aiReportPreview' | 'skinTypePreview';

interface UserInfo {
  name: string;
  age: string;
}

interface SurveyData {
  userInfo: UserInfo;
  answers: SurveyAnswers;
}

export default function App() {
  console.log('🚀 App component loaded!');
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', age: '' });
  const [surveyData, setSurveyData] = useState<SurveyData>({ 
    userInfo: { name: '', age: '' },
    answers: {}
  });
  const [surveyId, setSurveyId] = useState<string>('');
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

  const handleStart = () => {
    setCurrentScreen('intro');
  };



  const handleIntroComplete = () => {
    setCurrentScreen('guide');
  };

  const handleGuideComplete = () => {
    setCurrentScreen('userInfo');
  };

  const handleUserInfoSubmit = async (data: UserInfo) => {
    try {
      console.log('사용자 정보 저장 중...', data);
      
      // Supabase에 사용자 정보 저장
      const result = await createSurvey(data);
      
      if (result.success && result.surveyId) {
        setUserInfo(data);
        setSurveyId(result.surveyId);
        console.log('설문 생성 완료:', result.surveyId);
        setCurrentScreen('result');
      } else {
        console.error('설문 생성 실패:', result.error);
        alert(`오류가 발생했습니다: ${result.error}`);
      }
    } catch (error) {
      console.error('사용자 정보 저장 중 오류:', error);
      alert('사용자 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleBack = () => {
    setCurrentScreen('guide');
  };

  const handleRestart = () => {
    // SurveyStartScreen 없이 바로 Part 1으로 이동
    setSurveyData({ userInfo, answers: {} });
    setCurrentScreen('part1');
  };

  // Part별 핸들러들
  const handlePart1Complete = () => setCurrentScreen('part1Questions');
  const handlePart1QuestionsComplete = (answers: Partial<SurveyAnswers>) => {
    setSurveyData(prev => ({ ...prev, answers: { ...prev.answers, ...answers } as SurveyAnswers }));
    setCurrentScreen('part2');
  };

  const handlePart2Complete = () => setCurrentScreen('part2Questions');
  const handlePart2QuestionsComplete = (answers: Partial<SurveyAnswers>) => {
    setSurveyData(prev => ({ ...prev, answers: { ...prev.answers, ...answers } as SurveyAnswers }));
    setCurrentScreen('part3');
  };

  const handlePart3Complete = () => setCurrentScreen('part3Questions');
  const handlePart3QuestionsComplete = (answers: Partial<SurveyAnswers>) => {
    setSurveyData(prev => ({ ...prev, answers: { ...prev.answers, ...answers } as SurveyAnswers }));
    setCurrentScreen('part4');
  };

  const handlePart4Complete = () => setCurrentScreen('part4Questions');
  const handlePart4QuestionsComplete = (answers: Partial<SurveyAnswers>) => {
    setSurveyData(prev => ({ ...prev, answers: { ...prev.answers, ...answers } as SurveyAnswers }));
    setCurrentScreen('part5');
  };

  const handlePart5Complete = () => setCurrentScreen('part5Questions');
  const handlePart5QuestionsComplete = (answers: Partial<SurveyAnswers>) => {
    setSurveyData(prev => ({ ...prev, answers: { ...prev.answers, ...answers } as SurveyAnswers }));
    setCurrentScreen('part6');
  };

  const handlePart6Complete = () => setCurrentScreen('part6Questions');
  const handlePart6QuestionsComplete = (answers: Partial<SurveyAnswers>) => {
    setSurveyData(prev => ({ ...prev, answers: { ...prev.answers, ...answers } as SurveyAnswers }));
    setCurrentScreen('part7');
  };

  const handlePart7Complete = () => setCurrentScreen('part7Questions');
  const handlePart7QuestionsComplete = (answers: Partial<SurveyAnswers>) => {
    // 모든 Part 완료 후 최종 처리
    const finalAnswers = { ...surveyData.answers, ...answers } as SurveyAnswers;
    setSurveyData(prev => ({ ...prev, answers: finalAnswers }));
    handleSurveyComplete(finalAnswers);
  };

  const handleSurveyComplete = async (answers: SurveyAnswers) => {
    try {
      console.log('설문 답변 저장 중...', answers);
      
      if (!surveyId) {
        console.error('Survey ID가 없습니다.');
        alert('설문 정보를 찾을 수 없습니다. 처음부터 다시 시작해주세요.');
        setCurrentScreen('start');
        return;
      }

      // 설문 데이터 업데이트
      const updatedSurveyData = { userInfo, answers };
      setSurveyData(updatedSurveyData);

      // Supabase에 설문 답변 저장 (모든 답변 포함)
      const updateData: any = {
        skinType: answers.skin_type || '',
        status: 'completed',
        answers: JSON.stringify(answers)
      };

      const result = await updateSurvey(surveyId, updateData);
      
      if (result.success) {
        console.log('✅ 설문 답변 저장 완료');
        
        // Make.com이 자동으로 변경 사항을 감지합니다
        console.log('📊 설문 데이터 저장 완료:', {
          id: surveyId,
          name: userInfo.name,
          age: parseInt(userInfo.age),
          skin_type: answers.skin_type,
          status: 'completed'
        });
        
        // 설문 완료 화면으로 이동
        setCurrentScreen('surveyComplete');
        
        // Make.com이 Supabase row 변경을 감지하여 자동으로 AI 레시피 생성 시작
        console.log('✅ 설문 완료! Make.com 시나리오가 자동으로 트리거됩니다.');
        console.log('🤖 AI 레시피는 별도로 생성되며 앱에서는 더 이상 처리하지 않습니다.');
        
      } else {
        console.error('설문 답변 저장 실패:', result.error);
        
        // answers 컬럼 관련 오류인 경우 스키마 업데이트 시도
        if (result.error?.includes('answers') || result.error?.includes('column')) {
          console.log('🔧 Attempting to fix schema issue...');
          const schemaResult = await updateDatabaseSchema();
          
          if (schemaResult.success) {
            alert('데이터베이스 스키마가 업데이트되었습니다. 다시 시도해주세요.');
            return;
          } else {
            alert(`스키마 오류가 발생했습니다.\\n\\n수동 수정이 필요합니다:\\n1. Supabase Dashboard > SQL Editor로 이동\\n2. 다음 SQL 실행:\\nALTER TABLE ai_cosmetic_surveys ADD COLUMN IF NOT EXISTS answers JSONB;\\n\\n오류: ${result.error}`);
            return;
          }
        }
        
        // 설문 완료 화면으로 이동 (저장 실패 시에도)
        console.log('⚠️ 설문 답변 저장 실패했지만 화면은 진행합니다.');
        setCurrentScreen('surveyComplete');
        
        alert(`오류가 발생했습니다: ${result.error}\\n\\n화면은 계속 진행되지만 데이터가 저장되지 않았을 수 있습니다.`);
      }
    } catch (error) {
      console.error('설문 답변 저장 중 오류:', error);
      alert('설문 답변 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSurveyRestart = () => {
    // 설문 다시 시작 시 Part 1으로 바로 이동
    setSurveyData({ userInfo, answers: {} });
    setCurrentScreen('part1');
  };

  const handleShowAIReport = (recommendation: any) => {
    setAiRecommendation(recommendation);
    setCurrentScreen('aiReportPreview');
  };



  const handleAIReportBack = () => {
    // 실제 설문에서 온 경우 설문 완료 화면으로
    setCurrentScreen('surveyComplete');
  };

  return (
    <ErrorBoundary>
      <div className="w-full h-full min-h-screen relative overflow-auto bg-white">
        <Toaster position="top-center" />
        <AnimatePresence mode="wait">
        {currentScreen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"

          >
            <StartScreen 
              onStart={handleStart}
              onSkinTypePreview={() => setCurrentScreen('skinTypePreview')}
            />
          </motion.div>
        )}

        {currentScreen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"
          >
            <IntroScreen onComplete={handleIntroComplete} />
          </motion.div>
        )}

        {currentScreen === 'guide' && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"
          >
            <GuideScreen onComplete={handleGuideComplete} />
          </motion.div>
        )}

        {currentScreen === 'userInfo' && (
          <motion.div
            key="userInfo"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"
          >
            <UserInfoForm onSubmit={handleUserInfoSubmit} onBack={handleBack} />
          </motion.div>
        )}

        {currentScreen === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"
          >
            <ReportResult userInfo={userInfo} onRestart={handleRestart} />
          </motion.div>
        )}

        {/* Part 1 인트로 */}
        {currentScreen === 'part1' && (
          <motion.div
            key="part1"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Part1Intro onComplete={handlePart1Complete} />
          </motion.div>
        )}

        {/* Part 1 질문들 */}
        {currentScreen === 'part1Questions' && (
          <motion.div
            key="part1Questions"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SurveyFlow 
              key={`survey-part-${1}`}
              userName={userInfo.name} 
              currentPart={1}
              onComplete={handlePart1QuestionsComplete}
              onBack={() => setCurrentScreen('part1')}
            />
          </motion.div>
        )}

        {/* Part 2 인트로 */}
        {currentScreen === 'part2' && (
          <motion.div
            key="part2"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Part2Intro onComplete={handlePart2Complete} />
          </motion.div>
        )}

        {/* Part 2 질문들 */}
        {currentScreen === 'part2Questions' && (
          <motion.div
            key="part2Questions"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SurveyFlow 
              key={`survey-part-${2}`}
              userName={userInfo.name} 
              currentPart={2}
              onComplete={handlePart2QuestionsComplete}
              onBack={() => setCurrentScreen('part2')}
            />
          </motion.div>
        )}

        {/* Part 3 인트로 */}
        {currentScreen === 'part3' && (
          <motion.div
            key="part3"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Part3Intro onComplete={handlePart3Complete} />
          </motion.div>
        )}

        {/* Part 3 질문들 */}
        {currentScreen === 'part3Questions' && (
          <motion.div
            key="part3Questions"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SurveyFlow 
              key={`survey-part-${3}`}
              userName={userInfo.name} 
              currentPart={3}
              onComplete={handlePart3QuestionsComplete}
              onBack={() => setCurrentScreen('part3')}
            />
          </motion.div>
        )}

        {/* Part 4 인트로 */}
        {currentScreen === 'part4' && (
          <motion.div
            key="part4"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Part4Intro onComplete={handlePart4Complete} />
          </motion.div>
        )}

        {/* Part 4 질문들 */}
        {currentScreen === 'part4Questions' && (
          <motion.div
            key="part4Questions"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SurveyFlow 
              key={`survey-part-${4}`}
              userName={userInfo.name} 
              currentPart={4}
              onComplete={handlePart4QuestionsComplete}
              onBack={() => setCurrentScreen('part4')}
            />
          </motion.div>
        )}

        {/* Part 5 인트로 */}
        {currentScreen === 'part5' && (
          <motion.div
            key="part5"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Part5Intro onComplete={handlePart5Complete} />
          </motion.div>
        )}

        {/* Part 5 질문들 */}
        {currentScreen === 'part5Questions' && (
          <motion.div
            key="part5Questions"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SurveyFlow 
              key={`survey-part-${5}`}
              userName={userInfo.name} 
              currentPart={5}
              onComplete={handlePart5QuestionsComplete}
              onBack={() => setCurrentScreen('part5')}
            />
          </motion.div>
        )}

        {/* Part 6 인트로 */}
        {currentScreen === 'part6' && (
          <motion.div
            key="part6"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Part6Intro onComplete={handlePart6Complete} />
          </motion.div>
        )}

        {/* Part 6 질문들 */}
        {currentScreen === 'part6Questions' && (
          <motion.div
            key="part6Questions"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SurveyFlow 
              key={`survey-part-${6}`}
              userName={userInfo.name} 
              currentPart={6}
              onComplete={handlePart6QuestionsComplete}
              onBack={() => setCurrentScreen('part6')}
            />
          </motion.div>
        )}

        {/* Part 7 인트로 */}
        {currentScreen === 'part7' && (
          <motion.div
            key="part7"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <Part7Intro onComplete={handlePart7Complete} />
          </motion.div>
        )}

        {/* Part 7 질문들 */}
        {currentScreen === 'part7Questions' && (
          <motion.div
            key="part7Questions"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <SurveyFlow 
              key={`survey-part-${7}`}
              userName={userInfo.name} 
              currentPart={7}
              onComplete={handlePart7QuestionsComplete}
              onBack={() => setCurrentScreen('part7')}
            />
          </motion.div>
        )}

        {currentScreen === 'surveyComplete' && (
          <motion.div
            key="surveyComplete"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"
          >
            <SurveyComplete 
              userName={userInfo.name} 
              answers={surveyData.answers}
              onRestart={handleSurveyRestart}
              surveyId={surveyId}
              onShowAIReport={handleShowAIReport}
            />
          </motion.div>
        )}



        {currentScreen === 'aiReportPreview' && aiRecommendation && (
          <motion.div
            key="aiReportPreview"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0 overflow-auto"
          >
            <AI_Report_Figma
              userName={userInfo.name}
              skinType={Array.isArray(surveyData.answers.skin_type) ? surveyData.answers.skin_type[0] || '' : surveyData.answers.skin_type || ''}
              aiRecommendation={aiRecommendation}
              onBack={handleAIReportBack}
              surveyId={surveyId}
              onShare={() => {
                // 개인화된 공유 기능은 AI_Report_Figma 컴포넌트에서 처리
              }}
            />
          </motion.div>
        )}

        {currentScreen === 'skinTypePreview' && (
          <motion.div
            key="skinTypePreview"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0 overflow-auto"
          >
            <Suspense fallback={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#102A71] mx-auto mb-4"></div>
                  <p className="text-gray-600">디자인 프리뷰 로딩 중...</p>
                </div>
              </div>
            }>
              <SkinTypePreview
                onBack={() => setCurrentScreen('start')}
              />
            </Suspense>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}