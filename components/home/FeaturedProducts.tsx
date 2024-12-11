// app/components/home/FeaturedProducts.tsx
import EmptyList from '../global/EmptyList';
import SectionTitle from '../global/SectionTitle';
import ProductsGrid from '../products/ProductsGrid';
import { Product } from '@prisma/client';

type FeaturedProductsProps = {
  products: Product[];
};

function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return <EmptyList />;

  return (
    <section className="pt-24">
      <SectionTitle text="featured products" />
      <ProductsGrid products={products} />
    </section>
  );
}

export default FeaturedProducts;
