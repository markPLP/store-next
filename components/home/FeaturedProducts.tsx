import { fetchFeaturedProducts } from '@/utils/actions'; // Import your fetch logic
import EmptyList from '../global/EmptyList';
import SectionTitle from '../global/SectionTitle';
import ProductsGrid from '../products/ProductsGrid';
import { Product } from '@prisma/client';

async function FeaturedProducts() {
  // Fetch the data directly in the server-side component
  try {
    const products: Product[] = await fetchFeaturedProducts();

    if (products.length === 0) {
      return <EmptyList />;
    }

    return (
      <section className="pt-24">
        <SectionTitle text="Featured Products" />
        <ProductsGrid products={products} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return <div>Error fetching products</div>;
  }
}

export default FeaturedProducts;
