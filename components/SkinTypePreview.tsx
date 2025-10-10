import React, { useState, useMemo, Suspense } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Palette } from 'lucide-react';
import { skinTypeDesigns } from '../utils/skinTypeMapping';

interface SkinTypePreviewProps {
  onBack?: () => void;
}

// 간소화된 미리보기 컴포넌트
const SimplifiedPreview = React.memo(({ title, backgroundColor }: { title: string; backgroundColor: string }) => (
  <div 
    className="w-full h-full flex items-center justify-center text-white relative overflow-hidden"
    style={{ backgroundColor }}
  >
    {/* 그라데이션 오버레이 */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
    
    {/* 메인 텍스트 */}
    <div className="text-center z-10">
      <Palette className="w-8 h-8 mx-auto mb-2 opacity-80" />
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    
    {/* 장식 요소 */}
    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10" />
    <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20" />
  </div>
));

// 개별 카드 컴포넌트 메모이제이션
const SkinTypeCard = React.memo(({ 
  skinTypeKey, 
  design, 
  index, 
  onClick 
}: { 
  skinTypeKey: string; 
  design: any; 
  index: number; 
  onClick: () => void; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }} // 더 빠른 애니메이션
    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-gray-300"
    onClick={onClick}
  >
    {/* 간소화된 미니 프리뷰 */}
    <div className="h-48 relative overflow-hidden">
      <SimplifiedPreview 
        title={design.title}
        backgroundColor={design.backgroundColor}
      />
      
      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
          <Eye className="w-5 h-5 text-gray-700" />
        </div>
      </div>
    </div>

    {/* 정보 섹션 */}
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{design.title}</h3>
        <div 
          className="w-3 h-3 rounded-full border border-gray-300"
          style={{ backgroundColor: design.backgroundColor }}
        />
      </div>
      
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {design.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="bg-gray-100 px-2 py-1 rounded-full font-mono text-gray-600">
          {skinTypeKey}
        </span>
        <span className="text-gray-500">#{index + 1}</span>
      </div>
    </div>
  </motion.div>
));

export function SkinTypePreview({ onBack }: SkinTypePreviewProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [userName] = useState('홍길동'); // 테스트용 이름

  const skinTypes = useMemo(() => Object.entries(skinTypeDesigns), []);

  if (selectedType) {
    const design = skinTypeDesigns[selectedType];
    const Component = design.component;

    return (
      <div className="min-h-screen bg-gray-50 relative">
        {/* 헤더 */}
        <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSelectedType(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>뒤로가기</span>
            </button>
            
            <div className="text-center">
              <h1 className="font-semibold text-lg">{design.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{design.description}</p>
            </div>

            <div className="w-20" /> {/* 균형 맞추기 */}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="pt-24 pb-8">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-[400px] relative">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#102A71]"></div>
                  </div>
                }>
                  <Component userName={userName} />
                </Suspense>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">디자인 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">타입:</span>
                  <span className="font-medium">{design.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배경색:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: design.backgroundColor }}
                    />
                    <span className="font-mono text-xs">{design.backgroundColor}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">컴포넌트:</span>
                  <span className="font-mono text-xs">{selectedType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>메인으로</span>
            </button>
          )}
          
          <h1 className="font-bold text-xl text-center flex-1">
            🎨 피부 타입별 디자인 프리뷰
          </h1>

          <div className="w-20" />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              총 <span className="font-semibold text-[#102A71]">{skinTypes.length}개</span>의 피부 타입별 디자인을 확인하세요
            </p>
            <p className="text-sm text-gray-500">
              각 카드를 클릭하면 상세 프리뷰를 볼 수 있습니다
            </p>
          </div>

          {/* 최적화된 그리드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skinTypes.map(([key, design], index) => (
              <SkinTypeCard
                key={key}
                skinTypeKey={key}
                design={design}
                index={index}
                onClick={() => setSelectedType(key)}
              />
            ))}
          </div>

          {/* 하단 설명 */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">💡 동작 원리</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <span className="font-medium">AI 추천 결과</span>의 키워드를 분석하여 자동으로 적합한 디자인을 선택합니다.
                </p>
                <p>
                  예: "민감한 피부 진정" → <span className="font-medium text-[#102A71]">민감 케어</span> 디자인 표시
                </p>
                <p>
                  매칭되지 않는 경우 설문 답변 또는 기본 <span className="font-medium text-[#102A71]">보습</span> 타입이 적용됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}