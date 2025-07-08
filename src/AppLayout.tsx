import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen">
      {/* Header global éventuel */}
      <main>
        <Outlet />
      </main>
      {/* Footer global éventuel */}
    </div>
  );
} 