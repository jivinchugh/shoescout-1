import { ThemeProvider } from '@/context/ThemeProvider';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer hideLinks={true} />
      </div>
    </ThemeProvider>
  );
}