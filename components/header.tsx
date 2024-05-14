"use client"

import { TonConnectButton } from '@tonconnect/ui-react';
import Image from 'next/image';

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 max-w-5xl mx-auto px-5 p-2 my-8 rounded-xl shadow-lg bg-white">
      <div className="flex justify-between items-center">
        <Image src="/gorila.webp" width={40} height={40} alt='logo' />
             <div className="">
              <TonConnectButton />
            </div>
      </div>
    </div>
  );
};

export default Header;
