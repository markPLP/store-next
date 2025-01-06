import { FaStar } from 'react-icons/fa';

type ProductRatingProps = {
  rating: number;
  count: number;
};

function ProductRating({ rating, count }: ProductRatingProps) {
  // const rating = 4.2; // Static value for now
  // const count = 25; // Static value for now

  // fetch fetchProductRating in the singleProduct page
  //const { rating, count } = await fetchProductRating(productId);

  const className = `flex gap-1 items-center text-md mt-1 mb-4`;
  const countValue = `(${count}) reviews`;

  return (
    <span className={className}>
      <FaStar className="w-3 h-3" />
      {rating} {countValue}
    </span>
  );
}

export default ProductRating;
