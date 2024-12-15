'use server';

import db from '@/utils/db';
import { Product } from '@prisma/client';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { imageSchema, productSchema, validateWithZodSchema } from './schema';
import { uploadImage } from './supabase';
// helper function
const renderError = (error: unknown): { message: string } => {
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};
// helper function
const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
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
    // return { message: 'product created' }; no return here if we opt to redirect
  } catch (error) {
    return renderError(error);
  }
  redirect('/admin/products');
};
