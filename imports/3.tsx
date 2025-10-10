function Component3() {
  return (
    <div className="bg-white relative size-full" data-name="3">
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[normal] left-1/2 not-italic text-[#102a71] text-[80px] text-center text-nowrap tracking-[-2.4px] translate-x-[-50%] translate-y-[-50%] whitespace-pre" style={{ top: "calc(50% - 216px)" }}>
        <p className="mb-0">모르는 단어가</p>
        <p>나온다면</p>
      </div>
      <div className="absolute left-[407px] size-[86px] top-[836px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 86 86">
          <circle cx="43" cy="43" fill="var(--fill-0, #F5F5F5)" id="Ellipse 379" r="43" />
        </svg>
      </div>
      <div className="absolute font-['Pretendard:Regular',_sans-serif] leading-[0] not-italic text-[30px] text-black text-center text-nowrap top-[966px] tracking-[-0.9px] translate-x-[-50%]" style={{ left: "calc(50% + 0.5px)" }}>
        <p className="leading-[normal] whitespace-pre">우측 상단에 i 버튼을 눌러주세요</p>
      </div>
      <div className="absolute font-['Pretendard:Regular',_sans-serif] leading-[0] left-[450.5px] not-italic text-[30px] text-black text-center text-nowrap top-[861px] tracking-[-0.9px] translate-x-[-50%]">
        <p className="leading-[normal] whitespace-pre">i</p>
      </div>
    </div>
  );
}

export default function Component4() {
  return (
    <div className="bg-white relative size-full" data-name="3">
      <Component3 />
    </div>
  );
}