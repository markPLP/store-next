'use client';

import { useAuth } from '@clerk/nextjs';
import { CardSignInButton } from '../form/Button';
import FavoriteToggleButton from './FavoriteToggleButton';

function FavoriteToggleButtonWrapper({ productId }: { productId: string }) {
  const { userId } = useAuth();

  if (!userId) return <CardSignInButton />;

  return <FavoriteToggleButton productId={productId} />;
}

export default FavoriteToggleButtonWrapper;
