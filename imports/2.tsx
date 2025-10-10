function Component2() {
  return (
    <div className="bg-white leading-[0] not-italic relative size-full text-center text-nowrap" data-name="2">
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[normal] text-[#102a71] text-[80px] tracking-[-2.4px] translate-x-[-50%] translate-y-[-50%] whitespace-pre" style={{ top: "calc(50% - 216px)", left: "calc(50% + 0.5px)" }}>
        <p className="mb-0">사랑을 담아</p>
        <p>새로움을 전하다</p>
      </div>
      <div className="absolute font-['Pretendard:Regular',_sans-serif] left-[450.5px] text-[30px] text-black top-[861px] tracking-[-0.9px] translate-x-[-50%] whitespace-pre">
        <p className="leading-[normal] mb-0">식약처에 등록된</p>
        <p className="leading-[normal]">
          <span className="font-['Pretendard:SemiBold',_sans-serif] not-italic">맞춤 화장품 조제관리사</span>가 함께합니다
        </p>
      </div>
    </div>
  );
}

export default function Component3() {
  return (
    <div className="bg-white leading-[0] not-italic relative size-full text-center text-nowrap" data-name="2">
      <Component2 />
    </div>
  );
}