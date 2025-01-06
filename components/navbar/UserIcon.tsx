'use client';

import Image from 'next/image';
import { LuUser } from 'react-icons/lu';
import { useUser } from '@clerk/nextjs';

export default function UserIcon() {
  const { user } = useUser(); // useUser provides the user object

  if (user?.imageUrl) {
    return (
      <Image
        src={user.imageUrl}
        alt={user.username || 'User icon'} // Provide a fallback string
        width={24}
        height={24}
        className="rounded-full object-cover"
      />
    );
  }

  return <LuUser className="w-6 h-6 bg-primary rounded-full text-white" />;
}
