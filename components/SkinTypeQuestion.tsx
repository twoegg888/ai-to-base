import { useState } from 'react';
import { motion } from 'motion/react';

interface SkinTypeQuestionProps {
  userName: string;
  onSelectSkinType: (skinType: string) => void;
}

function Group1707481051({ userName }: { userName: string }) {
  return (
    <div className="absolute left-1/2 top-[180px] sm:top-[220px] md:top-[280px] transform -translate-x-1/2 w-full">
      <div className="font-['Pretendard:SemiBold',_sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black text-center leading-[1.2] tracking-[-1.5px] px-4">
        <p className="leading-[1.2]">
          '{userName}'님의 피부 타입은<br />
          무엇인가요?
        </p>
      </div>
    </div>
  );
}

export function SkinTypeQuestion({ userName, onSelectSkinType }: SkinTypeQuestionProps) {
  const [selectedType, setSelectedType] = useState<string>('');



  const handleSelectType = (skinType: string) => {
    setSelectedType(skinType);
    // 선택 후 바로 다음 단계로 진행
    setTimeout(() => {
      onSelectSkinType(skinType);
    }, 500);
  };

  return (
    <div className="bg-white relative size-full" data-name="5">
      {/* 버튼 1 - 건성 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`absolute h-[80px] sm:h-[96px] md:h-[112px] left-[20px] sm:left-[80px] md:left-[163px] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] top-[300px] sm:top-[340px] md:top-[398px] w-[calc(100%-40px)] sm:w-[calc(100%-160px)] md:w-[459px] cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-center justify-center ${
          selectedType === 'dry' ? 'bg-[#4f3d93] scale-[1.02]' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => handleSelectType('dry')}
      >
        <div aria-hidden="true" className={`absolute border-2 border-[#4f3d93] border-solid inset-0 pointer-events-none rounded-[16px] sm:rounded-[18px] md:rounded-[20px]`} />
        
        {/* 텍스트 */}
        <span className={`font-['Pretendard:SemiBold',_sans-serif] text-xl sm:text-2xl md:text-[32px] text-center tracking-[-0.64px] transition-colors duration-300 ${
          selectedType === 'dry' ? 'text-white' : 'text-[#4f3d93]'
        }`}>
          건성
        </span>
        
        {selectedType === 'dry' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute right-4 sm:right-5 md:right-6 top-1/2 transform -translate-y-1/2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* 버튼 2 - 지성 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`absolute h-[80px] sm:h-[96px] md:h-[112px] left-[20px] sm:left-[80px] md:left-[163px] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] top-[400px] sm:top-[456px] md:top-[530px] w-[calc(100%-40px)] sm:w-[calc(100%-160px)] md:w-[459px] cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-center justify-center ${
          selectedType === 'oily' ? 'bg-[#4f3d93] scale-[1.02]' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => handleSelectType('oily')}
      >
        <div aria-hidden="true" className={`absolute border-2 border-[#4f3d93] border-solid inset-0 pointer-events-none rounded-[16px] sm:rounded-[18px] md:rounded-[20px]`} />
        
        {/* 텍스트 */}
        <span className={`font-['Pretendard:SemiBold',_sans-serif] text-xl sm:text-2xl md:text-[32px] text-center tracking-[-0.64px] transition-colors duration-300 ${
          selectedType === 'oily' ? 'text-white' : 'text-[#4f3d93]'
        }`}>
          지성
        </span>
        
        {selectedType === 'oily' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute right-4 sm:right-5 md:right-6 top-1/2 transform -translate-y-1/2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* 버튼 3 - 중성 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`absolute h-[80px] sm:h-[96px] md:h-[112px] left-[20px] sm:left-[80px] md:left-[163px] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] top-[500px] sm:top-[572px] md:top-[662px] w-[calc(100%-40px)] sm:w-[calc(100%-160px)] md:w-[459px] cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-center justify-center ${
          selectedType === 'neutral' ? 'bg-[#4f3d93] scale-[1.02]' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => handleSelectType('neutral')}
      >
        <div aria-hidden="true" className={`absolute border-2 border-[#4f3d93] border-solid inset-0 pointer-events-none rounded-[16px] sm:rounded-[18px] md:rounded-[20px]`} />
        
        {/* 텍스트 */}
        <span className={`font-['Pretendard:SemiBold',_sans-serif] text-xl sm:text-2xl md:text-[32px] text-center tracking-[-0.64px] transition-colors duration-300 ${
          selectedType === 'neutral' ? 'text-white' : 'text-[#4f3d93]'
        }`}>
          중성
        </span>
        
        {selectedType === 'neutral' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute right-4 sm:right-5 md:right-6 top-1/2 transform -translate-y-1/2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* 메인 타이틀 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Group1707481051 userName={userName} />
      </motion.div>

      {/* 버튼 4 - 그 외 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`absolute h-[80px] sm:h-[96px] md:h-[112px] left-[20px] sm:left-[80px] md:left-[163px] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] top-[600px] sm:top-[688px] md:top-[794px] w-[calc(100%-40px)] sm:w-[calc(100%-160px)] md:w-[459px] cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-center justify-center ${
          selectedType === 'other' ? 'bg-[#4f3d93] scale-[1.02]' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => handleSelectType('other')}
      >
        <div aria-hidden="true" className={`absolute border-2 border-[#4f3d93] border-solid inset-0 pointer-events-none rounded-[16px] sm:rounded-[18px] md:rounded-[20px]`} />
        
        {/* 텍스트 */}
        <span className={`font-['Pretendard:SemiBold',_sans-serif] text-xl sm:text-2xl md:text-[32px] text-center tracking-[-0.64px] transition-colors duration-300 ${
          selectedType === 'other' ? 'text-white' : 'text-[#4f3d93]'
        }`}>
          그 외
        </span>
        
        {selectedType === 'other' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute right-4 sm:right-5 md:right-6 top-1/2 transform -translate-y-1/2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5 md:w-6 md:h-6">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* 정보 아이콘 - 완전히 중앙 정렬된 i 버튼 */}
      <div className="absolute right-[40px] sm:right-[80px] md:left-[766px] size-[50px] sm:size-[70px] md:size-[86px] top-[100px] sm:top-[120px] md:top-[140px] flex items-center justify-center">
        <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 86 86">
          <circle cx="43" cy="43" fill="var(--fill-0, #F5F5F5)" id="Ellipse 380" r="43" />
        </svg>
        <span className="relative font-['Pretendard:Regular',_sans-serif] text-lg sm:text-2xl md:text-[30px] text-black tracking-[-0.9px] z-10">
          i
        </span>
      </div>
    </div>
  );
}