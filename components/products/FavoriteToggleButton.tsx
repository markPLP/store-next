'use client';

import { useState, useEffect } from 'react';
import FavoriteToggleForm from './FavoriteToggleForm';
import { fetchFavoriteId } from '@/utils/actions';
import { CardSignInButton } from '../form/Button';
import { useAuth } from '@clerk/nextjs';

export default function FavoriteToggleButton({
  productId,
}: {
  productId: string;
}) {
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFavoriteId = await fetchFavoriteId({ productId });
      setFavoriteId(fetchedFavoriteId);
    };
    fetchData();
    setFavoriteId(productId);
  }, [productId]);

  return (
    <FavoriteToggleForm
      productId={productId}
      favoriteId={favoriteId}
      setFavoriteId={setFavoriteId} // Pass the setter function as a prop
    />
  );
}
