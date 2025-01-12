import Link from 'next/link';
// import { TbBrandVscode } from 'react-icons/tb';
import { FaReact } from 'react-icons/fa';
import { RiNextjsLine } from 'react-icons/ri';

import { Button } from '../ui/button';

function Logo() {
  return (
    <Button size="sm" asChild className="bg-transparent hover:bg-transparent">
      <Link href="/">
        <FaReact className="text-lg !w-14 !h-14 text-primary animate-[spin_5s_linear_infinite]" />
        <RiNextjsLine className="text-lg !w-14 !h-14 text-primary" />
      </Link>
    </Button>
  );
}

export default Logo;
