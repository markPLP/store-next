import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { fetchFeaturedProducts } from '@/utils/actions';

async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
    </>
  );
}

export default HomePage;
