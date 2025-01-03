'use client';

import { useState, useEffect } from 'react';
import FavoriteToggleForm from './FavoriteToggleForm';
import { fetchFavoriteId } from '@/utils/actions';

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
  }, [productId, favoriteId]);

  return (
    <FavoriteToggleForm
      productId={productId}
      favoriteId={favoriteId}
      setFavoriteId={setFavoriteId} // Pass the setter function as a prop
    />
  );
}
