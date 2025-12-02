// frontend/app/dashboard/layout.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  CircuitBoard, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut,
  Menu,
  User
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: CircuitBoard },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <CircuitBoard className="h-6 w-6" />
              <span className="font-bold text-xl">PCB Recon</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? 'secondary' : 'ghost'}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/dashboard/new-project')}
              className="hidden sm:flex"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>

            <Button
              variant="ghost"
              onClick={signOut}
              className="hidden sm:flex gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t md:hidden">
            <nav className="container py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/dashboard/new-project');
                }}
                className="w-full justify-start gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                New Project
              </Button>
              <Button
                variant="ghost"
                onClick={signOut}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}