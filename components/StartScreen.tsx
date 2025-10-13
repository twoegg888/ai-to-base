import { motion } from 'motion/react';
import { useEffect } from 'react';

interface StartScreenProps {
  onStart: () => void;
  onAIReportPreview?: () => void;
}

export function StartScreen({ onStart, onAIReportPreview }: StartScreenProps) {
  const handleTripleClick = () => {
    if (onAIReportPreview) {
      onAIReportPreview();
    }
  };

  // 자동으로 3초 후 다음 화면으로 진행
  useEffect(() => {
    const timer = setTimeout(() => {
      onStart();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white relative w-full min-h-screen flex flex-col items-center justify-center p-4"
      onClick={(e) => {
        if (e.detail === 3) { // 트리플클릭 감지
          handleTripleClick();
        }
      }}
    >
      {/* 메인 로고 */}
      <div className="flex flex-col pretendard-semibold justify-center leading-[normal] brand-color text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center tracking-[-0.03em]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="mb-0">AI</p>
          <p className="mb-0">&nbsp;</p>
          <p className="mb-0">To</p>
          <p className="mb-0">BASE</p>
        </motion.div>
      </div>

      {/* 부제목 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mt-8 text-center px-6"
      >
        <p className="text-gray-500 text-lg">
          AI가 분석하는 맞춤형 화장품 레시피
        </p>
        
        {/* 자동 진행 안내 */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="text-gray-400 text-sm mt-4"
        >
          잠시 후 자동으로 시작됩니다...
        </motion.p>


      </motion.div>
    </motion.div>
  );
}