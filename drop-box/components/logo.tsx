"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      <Image
        src="/images/dropbox_icon.png"
        alt="Mini Dropbox Logo"
        width={50}
        height={30}
        className="!w-8 !h-auto"
        // 느낌표를 붙이면 더 우선순위를 갖게 된다.
      />
      <span className="text-xl font-bold">Minibox</span>
    </div>
  );
}
