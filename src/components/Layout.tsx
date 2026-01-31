import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart3, Lightbulb } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/insights', label: 'Insights', icon: Lightbulb },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <header className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BarChart3 size={32} style={{ color: 'var(--accent-blue)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                StonksBro
              </h1>
            </div>

            <nav className="flex gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                    style={{
                      color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      backgroundColor: active ? 'var(--bg-tertiary)' : 'transparent',
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
