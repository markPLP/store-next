// app/components/home/FeaturedProducts.tsx
import EmptyList from '../global/EmptyList';
import SectionTitle from '../global/SectionTitle';
import ProductsGrid from '../products/ProductsGrid';
import { fetchFeaturedProducts } from '@/utils/actions';
import { Product } from '@prisma/client';

export default async function FeaturedProducts() {
  try {
    // Fetching the featured products on the server side
    const products: Product[] = await fetchFeaturedProducts();

    if (products.length === 0) return <EmptyList />;

    return (
      <section className="pt-24">
        <SectionTitle text="featured products" />
        <ProductsGrid products={products} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return <div>Error fetching products</div>;
  }
}
