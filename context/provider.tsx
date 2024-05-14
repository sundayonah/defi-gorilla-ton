"use client"

import { TonConnectUIProvider } from '@tonconnect/ui-react';

interface TonProps {
  children: React.ReactNode;
}

export function TonProvider({ children }: TonProps) {
    return (
        <TonConnectUIProvider manifestUrl="http://localhost:3001/tonconnect-manifest.json">
            {children}
        </TonConnectUIProvider>
    );
}