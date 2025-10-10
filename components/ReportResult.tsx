import { useState } from 'react';
import { motion } from 'motion/react';
import { TypewriterText } from './TypewriterText';
import { Button } from './ui/button';

interface UserInfo {
  name: string;
  age: string;
}

interface ReportResultProps {
  userInfo: UserInfo;
  onRestart: () => void;
}

export function ReportResult({ userInfo, onRestart }: ReportResultProps) {
  const [showButton, setShowButton] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="bg-white size-full flex flex-col justify-center items-center px-6 sm:px-8 md:px-12"
    >
      <div className="max-w-lg mx-auto w-full text-center">
        {/* 메인 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="pretendard-semibold text-3xl sm:text-4xl md:text-5xl brand-color mb-6">
            반가워요 {userInfo.name}님!
          </h1>
        </motion.div>

        {/* 감사 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="font-['Pretendard:Regular',_sans-serif] text-lg sm:text-xl text-gray-600 leading-relaxed space-y-2">
            <TypewriterText
              text="이제 AI를 통해,"
              speed={80}
              delay={300}
              className="block"
            />
            <TypewriterText
              text="맞춤 화장품 레시피를 만들어볼까요?"
              speed={80}
              delay={1500}
              onComplete={() => setShowButton(true)}
              className="block"
            />
          </div>
        </motion.div>

        {/* 재시작 버튼 */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Button
              onClick={onRestart}
              className="bg-[#102a71] hover:bg-[#0d2260] text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 font-['Pretendard:Medium',_sans-serif]"
            >
              레시피 짜러가기
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}