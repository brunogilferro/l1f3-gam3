'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  Star,
  Bell,
  LogOut,
  LayoutDashboard,
  Inbox,
  Coins,
  FolderKanban,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const NAV_ITEMS = [
  { href: '/', label: 'DASHBOARD', icon: LayoutDashboard },
  { href: '/inbox', label: 'CAIXA DE ENTRADA', icon: Inbox },
  { href: '/apostas', label: 'APOSTAS', icon: Coins },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // TODO: replace with real notifications from API
  const notificationCount = 0;

  useEffect(() => {
    if (!notificationsOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notificationsOpen]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const initials = user?.initials ?? user?.shortName?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <header className="bg-bg-primary h-14 flex items-center justify-between px-3 md:px-5 border-b border-border-primary shrink-0 z-30">
      {/* Left: logo + nav */}
      <div className="flex items-center gap-2 md:gap-6 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-1.5 text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
          <Star className="w-5 h-5 text-accent-primary fill-accent-primary" />
          <span className="text-[15px] tracking-[2px] text-text-primary hidden sm:inline">
            L1F3 <span className="text-accent-primary">GAME</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] tracking-[0.5px] transition-all ${
                  active
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: bell + user */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="relative p-1 cursor-pointer"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 text-text-secondary hover:text-text-primary transition-colors" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 left-3.5 bg-accent-primary text-bg-secondary text-[11px] w-4 h-4 rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+8px)] w-[calc(100vw-24px)] sm:w-[400px] max-h-[480px] bg-bg-surface border border-border-primary rounded-xl shadow-lg overflow-hidden flex flex-col z-50"
              >
                <div className="px-4 py-3 border-b border-border-primary flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm text-text-primary">Notificações</span>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="p-1 text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Bell className="w-8 h-8 text-border-primary" />
                  <p className="text-xs text-text-secondary">Nenhuma notificação</p>
                </div>
                <div className="px-4 py-2.5 border-t border-border-primary shrink-0">
                  <Link
                    href="/inbox"
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full text-center text-[11px] text-text-secondary hover:text-accent-primary cursor-pointer transition-colors py-1 block"
                  >
                    Ver caixa de entrada
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User info + avatar */}
        <div className="border-l border-border-primary pl-2 md:pl-3 flex items-center gap-2 md:gap-3">
          <div className="text-right hidden sm:block">
            {/* suppressHydrationWarning: user is null on SSR, populated on client from cookie */}
            <p className="text-sm text-text-primary" suppressHydrationWarning>
              {user?.shortName ?? ''}
            </p>
          </div>
          <div
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-bg-surface border-2 border-border-secondary hover:border-accent-primary transition-colors flex items-center justify-center overflow-hidden cursor-pointer"
            suppressHydrationWarning
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-text-secondary font-medium" suppressHydrationWarning>
                {initials}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Sair"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-bg-primary border-r border-border-primary z-50 flex flex-col md:hidden pt-14"
            >
              <div className="flex flex-col gap-1 p-4">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm tracking-[0.5px] transition-all ${
                        active
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary border-t border-border-primary flex items-center justify-around py-2 px-1">
        {[
          ...NAV_ITEMS,
          { href: '/projetos', label: 'Projetos', icon: FolderKanban },
        ].map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                active ? 'text-accent-primary' : 'text-text-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
