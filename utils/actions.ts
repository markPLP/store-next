'use server';

import db from '@/utils/db';
import { Product } from '@prisma/client';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from './schema';
import { deleteImage, uploadImage } from './supabase';
import { revalidatePath } from 'next/cache';

// helper function
const renderError = (error: unknown): { message: string } => {
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};
// helper function
export const getAuthUser = async () => {
  const user = await currentUser();
  // console.log(user);

  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  return user;
};

// helper function
const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });

  return products;
};

export const fetchAllProducts = async ({
  search = '',
}: {
  search?: string;
}) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    redirect('/products');
  }
  return product;
};

export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);

    await db.product.create({
      data: {
        ...validatedFields,
        image: fullPath, // '/images/product-1.jpg'
        clerkId: user.id,
      },
    });
    //return { message: 'product created' }; // no return here if we opt to redirect redirect('/admin/products')
  } catch (error) {
    return renderError(error);
  }
  redirect('/admin/products');
};

export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = await db.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  console.log(productId);

  await getAdminUser();

  try {
    // await db.product.delete({ // refactor to delete from supabase
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);

    revalidatePath('/admin/products'); // update UI -  Incremental Static Regeneration (ISR)
    // NOTE: This allows you to refresh the static data for a specific page or route without rebuilding the entire app.
    return { message: 'product removed' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect('/admin/products');
  return product;
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const productId = formData.get('id') as string;
    const rawData = Object.fromEntries(formData); // get all the form fields
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    //update the fields
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`); // update the UI
    return { message: 'Product updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAuthUser();
  try {
    const image = formData.get('image') as File;
    const productId = formData.get('id') as string;
    const oldImageUrl = formData.get('url') as string; // from hidden input name='url'

    const validatedFile = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFile.image);
    await deleteImage(oldImageUrl); // delete old image from supabase
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: 'Product Image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser();
  //  const pathname = usePathname();
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      // query result is only 'id'
      id: true,
    },
  });
  return favorite?.id || null; // null on first load
};

export const toggleFavoriteAction = async ({
  productId,
  favoriteId,
  pathname,
}: {
  productId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  try {
    if (favoriteId) {
      // If already favorited, remove from the database
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
      return { favoriteId: null, message: 'Removed from Faves' }; // Return null if removed
    } else {
      // If not favorited, add to the database
      const newFavorite = await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
      revalidatePath(pathname);
      return { favoriteId: newFavorite.id, message: 'Added to Faves' }; // Return new favoriteId
    }
  } catch (error) {
    return { error: renderError(error) }; // Return error message if any
  }
};

export const fetchUserFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });
  return favorites;
};

export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(reviewSchema, rawData);

    await db.review.create({
      data: {
        ...validatedFields,
        clerkId: user.id,
      },
    });
    revalidatePath(`/products/${validatedFields.productId}`);
    return { message: 'Review submitted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductReviews = async (productId: string) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return reviews;
};
export const fetchProductRating = async (productId: string) => {
  const result = await db.review.groupBy({
    by: ['productId'],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      productId,
    },
  });

  // empty array if no reviews
  return {
    //rating: result[0]?._avg.rating?.toFixed(1) ?? 0, // 0 if result returns null
    rating: result[0]?._avg.rating
      ? parseFloat(result[0]._avg.rating.toFixed(1))
      : 0, // Ensure rating is a number
    count: result[0]?._count.rating ?? 0,
  };
};
export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true, // review ID
      rating: true,
      comment: true,
      // from product model - relational
      product: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
  return reviews;
};
// bind option - value is in prev state - TS reviewID is string
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });

    revalidatePath('/reviews');
    return { message: 'Review deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

// return expects a value of NULL
export const findExistingReview = async (userId: string, productId: string) => {
  return db.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  });
};
