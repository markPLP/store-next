// export type actionFunction = (
//   prevState: any,
//   formData: FormData
// ) => Promise<{ message: string; favoriteId?: string | null }>; // function returns a Promise that resolves to an object with a 'message' property of type string

export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{
  favoriteId?: string | null;
  message?: string;
  error?: { message: string };
}>;

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
