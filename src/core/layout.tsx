import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-6 md:p-8 flex-grow flex flex-col items-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
