import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TypewriterText } from './TypewriterText';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UserInfoFormProps {
  onSubmit: (data: { name: string; age: string }) => void;
  onBack: () => void;
}

type Step = 'intro' | 'name' | 'age' | 'complete';

export function UserInfoForm({ onSubmit, onBack }: UserInfoFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 단계가 바뀔 때마다 입력 필드에 포커스
  useEffect(() => {
    if ((currentStep === 'name' || currentStep === 'age') && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 800); // 애니메이션 후 포커스
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleIntroComplete = () => {
    setCurrentStep('name');
  };

  const handleNext = () => {
    if (currentStep === 'name' && inputValue.trim()) {
      setName(inputValue.trim());
      setInputValue('');
      setCurrentStep('age');
    } else if (currentStep === 'age' && inputValue.trim() && parseInt(inputValue) > 0) {
      setAge(inputValue.trim());
      setCurrentStep('complete');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleNext();
    }
  };

  const handleComplete = () => {
    onSubmit({ name, age });
  };

  const isCurrentStepValid = () => {
    if (currentStep === 'name') return inputValue.trim().length > 0;
    if (currentStep === 'age') return inputValue.trim().length > 0 && parseInt(inputValue) > 0 && parseInt(inputValue) <= 120;
    return false;
  };

  return (
    <div className="bg-white relative min-h-full overflow-auto">
      <AnimatePresence mode="wait">
        {/* 인트로 화면 */}
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col justify-center items-center px-4"
          >
            {/* Figma 디자인의 제목 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col pretendard-semibold justify-center leading-[normal] brand-color text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center tracking-[-0.02em] mb-16"
            >
              <p className="mb-0">본인을 소개해주세요!</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="pretendard-regular text-lg sm:text-xl md:text-2xl text-gray-600 text-center tracking-[-0.01em] space-y-1">
                <TypewriterText
                  text="AI 맞춤형 레시피를 위해,"
                  speed={80}
                  delay={300}
                  className="block"
                />
                <TypewriterText
                  text="간단한 정보가 필요해요."
                  speed={80}
                  delay={1500}
                  onComplete={handleIntroComplete}
                  className="block"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 이름 입력 */}
        {currentStep === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-12"
          >
            <div className="max-w-md mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="pretendard-semibold text-2xl sm:text-3xl md:text-4xl brand-color mb-4">
                  이름을 알려주세요
                </h2>
                <p className="pretendard-regular text-gray-600 text-lg">
                  너무 궁금해요! 😊
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="이름을 입력해주세요"
                  className="w-full text-xl p-4 border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-[#102a71] focus:ring-0 transition-colors font-['Pretendard:Regular',_sans-serif]"
                  autoComplete="given-name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex gap-3"
              >
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 font-['Pretendard:Medium',_sans-serif]"
                >
                  이전
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className="flex-1 py-3 bg-[#102a71] hover:bg-[#0d2260] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-full font-['Pretendard:Medium',_sans-serif]"
                >
                  다음
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* 나이 입력 */}
        {currentStep === 'age' && (
          <motion.div
            key="age"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-12"
          >
            <div className="max-w-md mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="font-['Pretendard:SemiBold',_sans-serif] text-2xl sm:text-3xl md:text-4xl text-[#102a71] mb-4">
                  {name}님의 나이를<br />알려주세요
                </h2>
                <p className="font-['Pretendard:Regular',_sans-serif] text-gray-600 text-lg">
                  연령대에 맞는 레시피를 추천해드려요
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Input
                  ref={inputRef}
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="나이를 입력해주세요"
                  className="w-full text-xl p-4 border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-[#102a71] focus:ring-0 transition-colors font-['Pretendard:Regular',_sans-serif]"
                  min="1"
                  max="120"
                  inputMode="numeric"
                />
                {inputValue && (parseInt(inputValue) <= 0 || parseInt(inputValue) > 120) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-2 font-['Pretendard:Regular',_sans-serif]"
                  >
                    올바른 나이를 입력해주세요 (1-120세)
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex gap-3"
              >
                <Button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    setCurrentStep('name');
                  }}
                  variant="outline"
                  className="px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 font-['Pretendard:Medium',_sans-serif]"
                >
                  이전
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className="flex-1 py-3 bg-[#102a71] hover:bg-[#0d2260] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-full font-['Pretendard:Medium',_sans-serif]"
                >
                  다음
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* 완료 화면 */}
        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col justify-center items-center px-6 sm:px-8 md:px-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="font-['Pretendard:SemiBold',_sans-serif] text-3xl sm:text-4xl md:text-5xl text-[#102a71] mb-6">
                만나서 반가워요 {name}님!
              </h2>
              <div className="text-lg sm:text-xl text-gray-600 font-['Pretendard:Regular',_sans-serif] leading-relaxed">
                <p>{name}님의 정보는,</p>
                <p>AI가 여러분의 정보를 구분하는데에 사용됩니다.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <TypewriterText
                text="맞춤형 화장품 레시피를 분석 중입니다..."
                speed={80}
                delay={300}
                onComplete={() => {
                  setTimeout(handleComplete, 1500);
                }}
                className="font-['Pretendard:Regular',_sans-serif] text-lg sm:text-xl text-gray-600 text-center"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="w-16 h-16 border-4 border-[#102a71] border-t-transparent rounded-full animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}