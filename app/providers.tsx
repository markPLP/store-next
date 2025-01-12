'use client';

import { ThemeProvider } from './theme-provider';
import { CartProvider } from '@/context/CartContext';
// import { Toaster } from '@/components/ui/toaster';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        {/* <Toaster /> */}
      </ThemeProvider>
    </CartProvider>
  );
}

export default Providers;
