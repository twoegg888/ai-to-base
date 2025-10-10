import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestionCard } from './QuestionCard';

import { 
  surveyQuestions, 
  surveyParts,
  SurveyAnswers, 
  getQuestionProgress, 
  generateDynamicQuestions
} from '../data/surveyQuestions';
import type { QuestionData } from '../data/surveyQuestions';

interface SurveyFlowProps {
  userName: string;
  currentPart?: number; // 현재 Part 번호 (1-7)
  onComplete: (answers: SurveyAnswers | Partial<SurveyAnswers>) => void;
  onBack?: () => void; // 뒤로가기 콜백 (옵션)
}

export function SurveyFlow({ userName, currentPart, onComplete }: SurveyFlowProps) {
  // currentPart가 지정된 경우 해당 Part의 질문들만 필터링
  const getPartQuestions = (partNum?: number) => {
    if (!partNum) return surveyQuestions; // 전체 설문
    
    const part = surveyParts.find(p => p.partNumber === partNum);
    if (!part) {
      console.error('❌ Part를 찾을 수 없음:', partNum);
      return [];
    }
    
    const questions = surveyQuestions.slice(part.startIndex, part.endIndex + 1);
    return questions;
  };

  const partQuestions = useMemo(() => {
    return getPartQuestions(currentPart);
  }, [currentPart]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState<QuestionData[]>([]);

  // currentPart 변경 시에만 동적 질문 업데이트
  useEffect(() => {
    setDynamicQuestions(partQuestions);
    setCurrentQuestionIndex(0); // Part 변경 시 첫 번째 질문부터 시작
  }, [currentPart]);

  const currentQuestion = dynamicQuestions[currentQuestionIndex];
  const progress = currentPart ? (currentQuestionIndex + 1) / dynamicQuestions.length * 100 : getQuestionProgress(currentQuestionIndex);
  const isLastQuestion = currentQuestionIndex === dynamicQuestions.length - 1;

  // DEBUG: 필요시에만 활성화
  // console.log('🔍 SurveyFlow 상태:', {
  //   currentPart, currentQuestionIndex, currentQuestionId: currentQuestion?.id
  // });

  // 답변이 변경될 때만 동적 질문 업데이트 (전체 설문용)
  useEffect(() => {
    if (!currentPart) {
      // 전체 설문의 경우에만 동적 질문 생성
      const newDynamicQuestions = generateDynamicQuestions(answers);
      setDynamicQuestions(newDynamicQuestions);
    }
  }, [answers, currentPart]);

  const handleAnswer = async (questionId: string, answer: string | string[]) => {
    // 답변 저장
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // 마지막 질문인 경우 해당 Part 완료
      onComplete(newAnswers);
    } else {
      // 다음 질문으로 이동
      setIsTransitioning(true);
      
      setTimeout(() => {
        if (!currentPart) {
          // 전체 설문의 경우에만 동적 질문 업데이트
          const updatedQuestions = generateDynamicQuestions(newAnswers);
          setDynamicQuestions(updatedQuestions);
        }
        
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };



  // 현재 질문이 유효하지 않으면 에러 상태 표시
  if (!currentQuestion) {
    console.error('❌ currentQuestion이 없음!', {
      currentQuestionIndex,
      dynamicQuestionsLength: dynamicQuestions.length,
      dynamicQuestions: dynamicQuestions,
      firstQuestionDetails: dynamicQuestions[0]
    });
    
    return (
      <div className="bg-white relative size-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#102A71] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#102A71] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#102A71] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="text-xs text-red-500 text-center">
            질문을 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white relative min-h-full overflow-auto">
      {/* 진행률 표시 - 모바일 최적화 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm z-20"
      >
        <div className="flex items-center gap-2.5">
          {currentPart && (
            <span className="text-[13px] font-medium text-[#102A71]">
              part{currentPart}
            </span>
          )}
          <div className="w-16 h-[3px] bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#102A71] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="text-[11px] text-slate-600 font-medium">
            {currentQuestionIndex + 1}/{dynamicQuestions.length}
          </span>
        </div>
      </motion.div>

      {/* 질문 카드 - 전체 화면 사용 */}
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key={`question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              currentAnswer={answers[currentQuestion?.id]}
              userName={userName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}