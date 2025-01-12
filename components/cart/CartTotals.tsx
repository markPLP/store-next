'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { createOrderAction } from '@/utils/actions';
import FormContainer from '../form/FormContainer';
import { SubmitButton } from '../form/Button';
import { Cart } from '@prisma/client';
import { useCart } from '@/context/CartContext';
import { fetchCartItems } from '@/utils/actions';
import { toast } from '../ui/use-toast';

function CartTotals({ cart }: { cart: Cart }) {
  const { cartTotal, shipping, tax, orderTotal } = cart;
  const { setCountItemsInCart } = useCart();

  const handleCreateOrder = async (formData: FormData) => {
    const result = await createOrderAction(formData);
    const cartItems = await fetchCartItems();
    setCountItemsInCart(cartItems);
    // toast({ description: result.message, duration: 1500 });
    return { message: result.message };
  };

  return (
    <div>
      <Card className="p-8 ">
        <CartTotalRow label="Subtotal" amount={cartTotal} />
        <CartTotalRow label="Shipping" amount={shipping} />
        <CartTotalRow label="Tax" amount={tax} />
        <CardTitle className="mt-8">
          <CartTotalRow label="Order Total" amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      <FormContainer action={handleCreateOrder}>
        <SubmitButton text="Place Order" className="w-full mt-8" />
      </FormContainer>
    </div>
  );
}

function CartTotalRow({
  label,
  amount,
  lastRow,
}: {
  label: string;
  amount: number;
  lastRow?: boolean;
}) {
  return (
    <>
      <p className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </p>
      {lastRow ? null : <Separator className="my-2" />}
    </>
  );
}

export default CartTotals;
