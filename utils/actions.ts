'use server';

import db from '@/utils/db';
import { Cart, Product } from '@prisma/client';
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
import { create } from 'domain';

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
}): Promise<{ favoriteId?: string | null; message: string }> => {
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
    return renderError(error); // Return error message if any
  }
};

// export const toggleFavoriteAction = async (prevState: {
//   productId: string;
//   favoriteId: string | null;
//   pathname: string;
// }): Promise<{ favoriteId?: string; message: string }> => {
//   const user = await getAuthUser();
//   const { productId, favoriteId, pathname } = prevState;
//   try {
//     if (favoriteId) {
//       // If already favorited, remove from the database
//       await db.favorite.delete({
//         where: {
//           id: favoriteId,
//         },
//       });
//     } else {
//       // If not favorited, add to the database
//       await db.favorite.create({
//         data: {
//           productId,
//           clerkId: user.id,
//         },
//       });
//     }
//     revalidatePath(pathname);
//     console.log(favoriteId, 'favoriteIdfavoriteId');

//     return { message: favoriteId ? 'Removed from Faves' : 'Added to Faves' };
//   } catch (error) {
//     return renderError(error);
//   }
// };

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

export const fetchCartItems = async (): Promise<number> => {
  const { userId } = auth();

  const cart = await db.cart.findFirst({
    where: {
      clerkId: userId ?? '', // possible null so we use empty string
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart || 0; // return 0 if cart is null
};

// helper function
const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

// Include the related product in the cart
const includeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
};

export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string;
  errorOnFailure?: boolean;
}) => {
  let cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: includeProductClause,
  });

  if (!cart && errorOnFailure) {
    throw new Error('Cart not found');
  }

  if (!cart) {
    cart = await db.cart.create({
      data: {
        clerkId: userId,
      },
      include: includeProductClause,
    });
  }

  return cart;
};

const updateOrCreateCartItem = async ({
  productId,
  cartId,
  amount,
}: {
  productId: string;
  cartId: string;
  amount: number;
}) => {
  let cartItem = await db.cartItem.findFirst({
    where: {
      productId,
      cartId, // get the cartId and productId
    },
  });

  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    // create a new cart item if it doesn't exist
    cartItem = await db.cartItem.create({
      data: { amount, productId, cartId },
    });
  }
};

export const updateCart = async (cart: Cart) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true, // Include the related product // additional data to use
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }
  const tax = cart.taxRate * cartTotal;
  const shipping = cartTotal ? cart.shipping : 0; // set shipping to 0 if cartTotal is 0
  const orderTotal = cartTotal + tax + shipping;

  const currentCart = await db.cart.update({
    where: {
      id: cart.id,
    },

    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    },
    include: includeProductClause,
  });
  return { currentCart, cartItems };
};

export const addToCartAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const productId = formData.get('productId') as string;
    const amount = Number(formData.get('amount'));
    await fetchProduct(productId); // fetch product to ensure it exists

    const cart = await fetchOrCreateCart({ userId: user.id });
    await updateOrCreateCartItem({ productId, cartId: cart.id, amount });
    await updateCart(cart);
  } catch (error) {
    return renderError(error);
  }
  redirect('/cart');
};

export const removeCartItemAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const cartItemId = formData.get('id') as string;
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.delete({
      where: {
        id: cartItemId, // delete cart item by ID per user
        cartId: cart.id, // item actually belongs in this cart
      },
    });

    await updateCart(cart); // recalculate cart total from db
    revalidatePath('/cart');
    return { message: 'Item removed from cart' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const user = await getAuthUser();

  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    });
    await updateCart(cart);
    revalidatePath('/cart');
    return { message: 'cart updated' };
  } catch (error) {
    return renderError(error);
  }
};

export const createOrderAction = async (formData: FormData) => {
  const user = await getAuthUser();
  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    const order = await db.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    // remove cart if order/payment is successful
    await db.cart.delete({
      where: {
        id: cart.id,
      },
    });
    // Return a success message
    // return { message: 'Order placed successfully' };
  } catch (error) {
    return renderError(error);
  }
  redirect('/orders');
};

// fetch user orders
export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const orders = await db.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return orders;
};

// fetch admin orders
export const fetchAdminOrders = async () => {
  const user = await getAdminUser();

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return orders;
};
