import { fetchProductReviews } from '@/utils/actions';
import ReviewCard from './ReviewCard';
import SectionTitle from '../global/SectionTitle';

function ProductReviews({
  reviews,
}: {
  reviews: Array<{
    comment: string;
    rating: number;
    authorImageUrl: string;
    authorName: string;
    id: string;
  }>;
}) {
  // const reviews = await fetchProductReviews(productId);

  return (
    <div className="mt-16">
      <SectionTitle text="product reviews" />

      <div className="grid md:grid-cols-2 gap-8 my-8">
        {reviews.map((review) => {
          const { comment, rating, authorImageUrl, authorName } = review;
          //console.log(authorName, 'authorName');

          // constructed OBJECT to be passed in ReviewCard as props
          const reviewInfo = {
            comment,
            rating,
            image: authorImageUrl,
            name: authorName,
          };
          return <ReviewCard key={review.id} reviewInfo={reviewInfo} />;
        })}
      </div>
    </div>
  );
}
export default ProductReviews;
