// app/page.tsx
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts /> {/* No need to wrap in Suspense here */}
    </>
  );
}
