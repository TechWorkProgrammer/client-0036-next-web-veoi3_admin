import '@/styles/globals.css';
import {AppProps} from 'next/app';
import React, {useEffect} from 'react';
import HeadTitle from '@/components/HeadTitle';
import LoadingProvider from '@/context/Loader';
import {AlertProvider} from '@/context/Alert';
import {WalletProvider} from '@/context/Wallet';

import {DM_Sans} from 'next/font/google';

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-dm-sans',
    display: 'swap',
});

function MyApp({Component, pageProps}: AppProps) {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    return (
        <LoadingProvider>
            <AlertProvider>
                <WalletProvider>
                    <HeadTitle/>
                    <div className={`flex flex-col min-h-screen ${dmSans.variable}`}>
                        <Component {...pageProps} />
                    </div>
                </WalletProvider>
            </AlertProvider>
        </LoadingProvider>
    );
}

export default MyApp;
