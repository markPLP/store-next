import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { fetchFeaturedProducts } from '@/utils/actions';
import { Product } from '@prisma/client';

export const metadata = {
  title: 'Home | My E-Commerce Store',
  description: 'Discover featured products and exclusive offers.',
};

async function HomePage() {
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = await fetchFeaturedProducts();
  } catch (error) {
    console.error('Error fetching featured products:', error);
  }

  return (
    <>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
    </>
  );
}

export default HomePage;
