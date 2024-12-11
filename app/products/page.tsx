import ProductsContainer from '@/components/products/ProductsContainer';
import { Suspense } from 'react';

async function ProductsPage({
  searchParams,
}: {
  searchParams: { layout?: string; search?: string }; // optional - undefined on 1st load - no searchParams
}) {
  const layout = searchParams.layout || 'grid';
  const search = searchParams.search || '';
  return (
    <>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsContainer layout={layout} search={search} />
      </Suspense>
    </>
  );
}
export default ProductsPage;
