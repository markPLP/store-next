import ProductsContainer from '@/components/products/ProductsContainer';
import { fetchAllProducts } from '@/utils/actions';

async function ProductsPage({
  searchParams,
}: {
  searchParams: { layout?: string; search?: string };
}) {
  // Fetch products server-side based on search parameters
  const layout = searchParams.layout || 'grid';
  const search = searchParams.search || '';
  const products = await fetchAllProducts({ search });

  return (
    <>
      <ProductsContainer layout={layout} search={search} products={products} />
    </>
  );
}

export default ProductsPage;
