import { ReactNode } from 'react';
import PublishHelpDialog from '../publish/PublishHelpDialog';

interface StudioLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

export default function StudioLayout({ header, children }: StudioLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          {header}
        </div>
      </header>
      <main className="container px-4 md:px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-border/40 mt-16">
        <div className="container px-4 md:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              © 2026. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            <PublishHelpDialog />
          </div>
        </div>
      </footer>
    </div>
  );
}
