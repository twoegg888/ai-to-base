import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'motion/react';

interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionData {
  id: string;
  title: string;
  options: QuestionOption[];
  allowMultiple?: boolean;
}

interface QuestionCardProps {
  question: QuestionData;
  onAnswer: (questionId: string, answer: string | string[]) => void;
  currentAnswer?: string | string[];
  userName?: string;
}



const QuestionCard = memo(function QuestionCard({ question, onAnswer, currentAnswer, userName }: QuestionCardProps) {
  // Debug log removed for cleaner output

  // ✅ Hooks를 조건문 이전에 호출 (React 규칙 준수)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // currentAnswer 변경 시에만 selectedAnswers 업데이트
  useEffect(() => {
    if (!currentAnswer) {
      setSelectedAnswers([]);
    } else {
      const answers = Array.isArray(currentAnswer) ? currentAnswer : [currentAnswer];
      setSelectedAnswers(answers);
    }
  }, [currentAnswer]);

  // 질문 제목 포맷팅 (이름 대체) - 메모이제이션
  const formattedTitle = useCallback(() => {
    if (!question || !question.title) return '';
    if (!userName) return question.title;
    return question.title.replace('{userName}', `'${userName}'`);
  }, [question, userName]);

  // 옵션 클릭 핸들러 - 메모이제이션
  const handleOptionClick = useCallback((optionId: string) => {
    if (!question) return;
    
    if (question.allowMultiple) {
      // 다중 선택 모드
      setSelectedAnswers(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        } else {
          return [...prev, optionId];
        }
      });
    } else {
      // 단일 선택 모드 - 즉시 답변 전송
      onAnswer(question.id, optionId);
    }
  }, [question, onAnswer]);

  // 완료 버튼 클릭 핸들러 - 메모이제이션
  const handleComplete = useCallback(() => {
    if (!question) return;
    onAnswer(question.id, selectedAnswers);
  }, [question, selectedAnswers, onAnswer]);

  // ✅ Hooks 호출 후 조건부 렌더링
  if (!question) {
    // Question이 없는 경우
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-500 text-center">
          질문을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white relative size-full" style={{ minHeight: '100vh' }}>
      {/* 메인 질문 제목 - 컴팩트한 모바일 중심 디자인 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[100px] sm:top-[120px] w-full px-6">
        <div className="font-['Pretendard:SemiBold',_sans-serif] text-center leading-tight text-black tracking-tight max-w-[600px] mx-auto">
          <p 
            className="text-[22px] sm:text-[26px] md:text-[30px] leading-[1.2] tracking-[-0.8px] break-keep"
            dangerouslySetInnerHTML={{ __html: formattedTitle() }}
          />
        </div>
      </div>

      {/* 옵션 버튼들 - 더 컴팩트하고 모바일 최적화 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-6" 
           style={{ top: '220px' }}>
        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(option.id);
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1 + (index * 0.06),
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { type: "spring", stiffness: 600, damping: 30 }
                }}
                onClick={() => handleOptionClick(option.id)}
                className="relative h-[70px] sm:h-[80px] md:h-[90px] rounded-[18px] cursor-pointer flex items-center justify-center touch-manipulation"
              >
                {/* 배경과 테두리 - 토스급 부드러운 애니메이션 */}
                <motion.div
                  className="absolute inset-0 rounded-[18px]"
                  animate={{
                    backgroundColor: isSelected ? '#102A71' : 'transparent',
                    boxShadow: isSelected 
                      ? '0 4px 12px rgba(16, 42, 113, 0.15), 0 2px 6px rgba(16, 42, 113, 0.1)' 
                      : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    mass: 0.8
                  }}
                  whileHover={{
                    boxShadow: isSelected 
                      ? '0 6px 20px rgba(16, 42, 113, 0.2), 0 3px 10px rgba(16, 42, 113, 0.15)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
                  }}
                />

                {/* 테두리 */}
                <motion.div 
                  className="absolute inset-0 rounded-[18px] border-[1.5px] border-[#102A71] pointer-events-none"
                  animate={{
                    borderColor: isSelected ? '#102A71' : '#102A71',
                    opacity: isSelected ? 0.8 : 1,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                />
                
                {/* 옵션 텍스트 - 부드러운 색상 전환 */}
                <motion.div 
                  className="font-['Pretendard:SemiBold',_sans-serif] text-center px-4 text-[16px] sm:text-[18px] md:text-[20px] tracking-[-0.3px] leading-[1.3] relative z-10"
                  animate={{
                    color: isSelected ? '#ffffff' : '#102A71',
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 35 
                  }}
                >
                  <p className="break-keep">{option.label}</p>
                </motion.div>

                {/* 선택된 상태 체크 마크 - 토스급 등장 애니메이션 */}
                <motion.div
                  className="absolute right-3 top-1/2 z-20"
                  style={{ translateY: '-50%' }}
                  initial={false}
                  animate={isSelected ? {
                    scale: 1,
                    opacity: 1,
                    rotate: 0,
                  } : {
                    scale: 0.3,
                    opacity: 0,
                    rotate: -90,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 25,
                    mass: 0.6
                  }}
                >
                  <motion.svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.path 
                      d="M20 6L9 17L4 12" 
                      stroke="white" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={isSelected ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: "easeInOut",
                        delay: isSelected ? 0.1 : 0
                      }}
                    />
                  </motion.svg>
                </motion.div>

                {/* 선택 시 미묘한 리플 효과 */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-[18px] bg-white pointer-events-none"
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut",
                      repeat: 0
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 다중 선택인 경우 완료 버튼 */}
      {question.allowMultiple && selectedAnswers.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.button
              onClick={handleComplete}
              className="relative bg-[#102A71] text-white px-6 py-3 rounded-[16px] font-['Pretendard:SemiBold',_sans-serif] text-[15px] shadow-lg touch-manipulation overflow-hidden"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: '#0d1f5a',
                boxShadow: '0 8px 25px rgba(16, 42, 113, 0.25), 0 3px 10px rgba(16, 42, 113, 0.15)',
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { type: "spring", stiffness: 600, damping: 30 }
              }}
              initial={false}
              animate={{
                boxShadow: '0 4px 15px rgba(16, 42, 113, 0.2), 0 2px 6px rgba(16, 42, 113, 0.1)',
              }}
            >
              {/* 버튼 배경 그라디언트 효과 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
                style={{ opacity: 0.1 }}
              />
              
              <motion.span
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                다음 ({selectedAnswers.length}개 선택됨)
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* 정보 아이콘 - 토스급 호버 효과 */}
      <motion.div 
        className="absolute right-4 top-4 cursor-pointer"
        whileHover={{ 
          scale: 1.1,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { type: "spring", stiffness: 600, damping: 30 }
        }}
      >
        <motion.div 
          className="relative w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
          whileHover={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: { type: "spring", stiffness: 300, damping: 30 }
          }}
        >
          <motion.svg 
            className="block size-full" 
            fill="none" 
            preserveAspectRatio="none" 
            viewBox="0 0 86 86"
            whileHover={{
              rotate: [0, -3, 3, 0],
              transition: { duration: 0.5, ease: "easeInOut" }
            }}
          >
            <motion.circle 
              cx="43" 
              cy="43" 
              fill="#F5F5F5" 
              r="43"
              whileHover={{
                fill: "#EEEEEE",
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
            />
          </motion.svg>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{
              scale: 1.1,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            <motion.span 
              className="font-['Pretendard:Regular',_sans-serif] text-[18px] sm:text-[22px] text-black tracking-[-0.3px]"
              whileHover={{
                color: "#102A71",
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
            >
              i
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
});

export { QuestionCard };