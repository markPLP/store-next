import Link from 'next/link';
import { TbBrandVscode } from 'react-icons/tb';
import { Button } from '../ui/button';

function Logo() {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <TbBrandVscode />
      </Link>
    </Button>
  );
}

export default Logo;
