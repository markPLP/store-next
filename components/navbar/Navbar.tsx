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
      <Container className="grid grid-cols-[1fr,auto] gap-4 py-8 justify-items-start md:grid-cols-[1fr,auto,auto]">
        <Logo />
        <Suspense fallback={<div>Loading...</div>}>
          <NavSearch />
        </Suspense>
        <div className="order-2 flex gap-4 items-center md:order-3">
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
