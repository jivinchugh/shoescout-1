
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        'relative overflow-hidden rounded-full h-9 w-9 transition-all duration-300',
        theme === 'dark' ? 'text-primary-foreground' : 'text-primary',
      )}
    >
      <span className="sr-only">Toggle theme</span>
      
      <Sun
        className={cn(
          'absolute h-5 w-5 transition-all duration-500',
          theme === 'dark'
            ? 'rotate-90 opacity-0 scale-0'
            : 'rotate-0 opacity-100 scale-100'
        )}
      />
      
      <Moon
        className={cn(
          'absolute h-5 w-5 transition-all duration-500',
          theme === 'dark'
            ? 'rotate-0 opacity-100 scale-100'
            : '-rotate-90 opacity-0 scale-0'
        )}
      />
    </Button>
  );
}
