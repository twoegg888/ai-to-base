export default function NameTag() {
  return (
    <div className="bg-white relative size-full" data-name="name_tag">
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[0] not-italic text-[#102a71] text-[80px] text-center text-nowrap tracking-[-2.4px] translate-x-[-50%] translate-y-[-50%]" style={{ top: "calc(50% - 215.5px)", left: "calc(50% + 0.5px)" }}>
        <p className="leading-[normal] whitespace-pre">본인을 소개해주세요!</p>
      </div>
    </div>
  );
}