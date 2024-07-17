/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AppContextProvider } from "../util/ContextProvider";
import { Toaster } from 'react-hot-toast'
import PrelineScript from '@/util/PrelineScript';
import { UIProvider } from '@/util/UIProvider';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Fly Pizza: Order Delicious Pizzas Online',
  description: 'Welcome to PizzaFiesta, where every order is a celebration of flavors!',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className='scroll-smooth dark'>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description!} />
        <meta http-equiv="Content-Security-Policy" content="frame-src 'self' blob: https://*.paypal.com https://*.paypal.cn https://*.paypalobjects.com https://objects.paypal.cn https://*.cardinalcommerce.com https://www.google.com https://www.recaptcha.net https://*.qualtrics.com https://bid.g.doubleclick.net/" />
        <link href="https://fonts.googleapis.com/css?family=Josefin+Sans:400,500,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&display=swap" rel="stylesheet" />
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        <script src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PAYPAY_CLIENT_ID}`} async defer></script>
        <script nonce="MPZW9bE7mUQpuI/pppVhboQ/YxYRXp8LAnLHDAgom0mxyQkB"></script>
      </head>
      <body className="font-poppins bg-[url('/assets/bg_dark.jpg')] bg-repeat bg-fixed">
        <UIProvider>
          <main>
            <AppContextProvider>
              <Toaster />
              <Header />
              {children}
              <Footer />
            </AppContextProvider>
          </main>
        </UIProvider>
        <PrelineScript />
      </body>
    </html>
  )
}
