import Image from "next/image";

export default function LogoTitle() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/medha-primary.png"
        alt="Medha-Logo"
        width={144}
        height={144}
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36"
      />

      <p className="font-bold text-black text-base sm:text-lg md:text-3xl leading-snug text-center mt-4 md:mt-10 sm:mt-10">
        FinTool
      </p>
    </div>
  );
}
