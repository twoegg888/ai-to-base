function Component1() {
  return (
    <div className="bg-white relative size-full" data-name="1">
      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[normal] left-1/2 not-italic text-[#102a71] text-[50px] text-center text-nowrap top-1/2 tracking-[-1.5px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">AI</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">To</p>
        <p>BASE</p>
      </div>
    </div>
  );
}

export default function Component2() {
  return (
    <div className="bg-white relative size-full" data-name="1">
      <Component1 />
    </div>
  );
}