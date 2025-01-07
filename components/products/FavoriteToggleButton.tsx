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
  }, [productId]);

  return (
    <FavoriteToggleForm
      productId={productId}
      favoriteId={favoriteId}
      setFavoriteId={setFavoriteId} // Pass the setter function as a prop
    />
  );
}

// import { auth } from '@clerk/nextjs/server';
// import { CardSignInButton } from '../form/Button';
// import { fetchFavoriteId } from '@/utils/actions';
// import FavoriteToggleForm from './FavoriteToggleForm';
// async function FavoriteToggleButton({ productId }: { productId: string }) {
//   const { userId } = auth();
//   if (!userId) return <CardSignInButton />;
//   const favoriteId = await fetchFavoriteId({ productId });

//   return <FavoriteToggleForm favoriteId={favoriteId} productId={productId} />;
// }
// export default FavoriteToggleButton;
