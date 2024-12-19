import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { fetchFeaturedProducts } from '@/utils/actions';
import { Product } from '@prisma/client';
import { Suspense } from 'react';
import LoadingContainer from '@/components/global/LoadingContainer';

export const metadata = {
  title: 'Home | My E-Commerce Store',
  description: 'Discover featured products and exclusive offers.',
};

async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts products={featuredProducts} />
      </Suspense>
    </>
  );
}

export default HomePage;
