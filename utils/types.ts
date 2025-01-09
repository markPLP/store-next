import { Prisma } from '@prisma/client';

export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>; // function returns a Promise that resolves to an object with a 'message' property of type string

export type CartItem = {
  productId: string;
  image: string;
  title: string;
  price: string;
  amount: number;
  company: string;
};

export type CartState = {
  cartItems: CartItem[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
};

// cart item and prodcut as a single object payload
export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;
