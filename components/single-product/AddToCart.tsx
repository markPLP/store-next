'use client';
import { useState } from 'react';
import SelectProductAmount from './SelectProductAmount';
import { Mode } from './SelectProductAmount';
import FormContainer from '../form/FormContainer';
import { SubmitButton } from '../form/Button';
import { addToCartAction, fetchCartItems } from '@/utils/actions';
import { useAuth } from '@clerk/nextjs';
import { ProductSignInButton } from '../form/Button';
import { useCart } from '@/context/CartContext';

function AddToCart({ productId }: { productId: string }) {
  const [amount, setAmount] = useState(1);
  const { userId } = useAuth(); // use useAuth if client component
  const { setCountItemsInCart } = useCart();

  const handleAddToCart = async (): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('amount', amount.toString());
    await addToCartAction({ productId, amount }, formData);
    const cartItems = await fetchCartItems();
    setCountItemsInCart(cartItems);
    return { message: 'Item added to the cart' };
  };

  return (
    <div className="mt-4">
      <SelectProductAmount
        mode={Mode.SingleProduct}
        amount={amount}
        setAmount={setAmount}
      />
      {userId ? (
        <FormContainer action={handleAddToCart}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="amount" value={amount} />
          <SubmitButton text="add to cart" size="default" className="mt-8" />
        </FormContainer>
      ) : (
        <ProductSignInButton /> // display sign in button if user is not signed in
      )}
    </div>
  );
}
export default AddToCart;
