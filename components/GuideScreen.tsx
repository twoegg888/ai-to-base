import { motion } from 'motion/react';
import { TypewriterText } from './TypewriterText';

interface GuideScreenProps {
  onComplete: () => void;
}

export function GuideScreen({ onComplete }: GuideScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white relative size-full flex flex-col justify-center items-center text-center px-4"
    >
      {/* 메인 텍스트 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col pretendard-semibold justify-center leading-[normal] brand-color text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.02em] mb-16 md:mb-32"
      >
        <p className="mb-0">모르는 단어가</p>
        <p className="mb-0">나온다면</p>
      </motion.div>

      {/* i 버튼과 설명 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="flex flex-col items-center mb-8"
      >
        {/* i 버튼 */}
        <div className="relative mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <span className="font-['Pretendard:Regular',_sans-serif] text-2xl sm:text-3xl md:text-4xl text-black">
              i
            </span>
          </motion.div>
        </div>

        {/* 하단 설명 텍스트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <TypewriterText
            text="우측 상단에 i 버튼을 눌러주세요"
            speed={80}
            delay={300}
            onComplete={() => {
              // TypewriterText 완료 후 2초 대기 후 다음 화면으로 전환 (총 4초)
              setTimeout(() => {
                onComplete();
              }, 2000);
            }}
            className="font-['Pretendard:Regular',_sans-serif] text-lg sm:text-xl md:text-2xl lg:text-3xl text-black tracking-[-0.02em]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}