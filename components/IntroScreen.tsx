import { motion } from 'motion/react';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
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
        className="flex flex-col pretendard-semibold justify-center leading-[normal] brand-color text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.02em] mb-8 md:mb-16"
      >
        <p className="mb-0">사랑을 담아</p>
        <p className="mb-0">새로움을 전하다</p>
      </motion.div>

      {/* 하단 텍스트 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onAnimationComplete={() => {
          // 모든 애니메이션이 완료되면 3초 후 자동으로 다음 화면으로 전환
          setTimeout(() => {
            onComplete();
          }, 1500); // 하단 텍스트 애니메이션 완료 후 1.5초 대기 (총 약 3초)
        }}
        className="font-['Pretendard:Regular',_sans-serif] text-lg sm:text-xl md:text-2xl lg:text-3xl text-black tracking-[-0.02em] max-w-lg"
      >
        <p className="leading-normal mb-1">식약처에 등록된</p>
        <p className="leading-normal">
          <span className="font-['Pretendard:SemiBold',_sans-serif]">맞춤 화장품 조제관리사</span>가 함께합니다
        </p>
      </motion.div>
    </motion.div>
  );
}