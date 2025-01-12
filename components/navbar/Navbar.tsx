import Container from '../global/Container';
import { lazy, Suspense } from 'react';
const CartButton = lazy(() => import('./CartButton'));
import DarkMode from './DarkMode';
import LinksDropdown from './LinksDropdown';
import Logo from './Logo';
import NavSearch from './NavSearch';

function Navbar() {
  return (
    <nav className="border-b">
      <Container className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-8">
        <Logo />
        <Suspense fallback={<div>Loading...</div>}>
          <NavSearch />
        </Suspense>
        <div className="flex gap-4 items-center">
          <Suspense fallback={<div>Loading...</div>}>
            <CartButton />
          </Suspense>
          <DarkMode />
          <LinksDropdown />
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
