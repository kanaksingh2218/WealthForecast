import { Outlet, Link } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="layout min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 p-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-500">WealthLens</Link>
        <nav className="flex gap-6">
          <Link to="/" className="hover:text-blue-400">Dashboard</Link>
          <Link to="/transactions" className="hover:text-blue-400">Transactions</Link>
          <Link to="/forecast" className="hover:text-blue-400">Forecast</Link>
          <Link to="/import" className="hover:text-blue-400">Import</Link>
        </nav>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};
