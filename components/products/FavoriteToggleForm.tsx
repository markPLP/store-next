'use client';

import { usePathname } from 'next/navigation';
import FormContainer from '../form/FormContainer';
import { toggleFavoriteAction } from '@/utils/actions';
import { CardSubmitButton } from '../form/Button';

type FavoriteToggleFormProps = {
  productId: string;
  favoriteId: string | null;
  setFavoriteId: React.Dispatch<React.SetStateAction<string | null>>; // Add the setter type
};

function FavoriteToggleForm({
  productId,
  favoriteId,
  setFavoriteId,
}: FavoriteToggleFormProps) {
  const pathname = usePathname();

  const toggleAction = async () => {
    const { favoriteId: newFavoriteId, message } = await toggleFavoriteAction({
      productId,
      favoriteId,
      pathname,
    });

    if (newFavoriteId !== undefined) {
      setFavoriteId(newFavoriteId); // Update the parent state with the new favoriteId
    }

    return { message };
  };

  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavorite={favoriteId ? true : false} />
    </FormContainer>
  );
}

export default FavoriteToggleForm;

// import { usePathname } from 'next/navigation';
// import { toggleFavoriteAction } from '@/utils/actions';
// import { CardSubmitButton } from '../form/Button';
// import { useToast } from '../ui/use-toast';

// type FavoriteToggleFormProps = {
//   productId: string;
//   favoriteId: string | null;
//   setFavoriteId: React.Dispatch<React.SetStateAction<string | null>>; // Add the setter type
// };

// function FavoriteToggleForm({
//   productId,
//   favoriteId,
//   setFavoriteId,
// }: FavoriteToggleFormProps) {
//   const pathname = usePathname();
//   const { toast } = useToast();
//   const handleToggle = async (event: React.FormEvent) => {
//     event.preventDefault(); // Prevent form submission
//     const { favoriteId: newFavoriteId, message } = await toggleFavoriteAction({
//       productId,
//       favoriteId,
//       pathname,
//     });

//     if (newFavoriteId !== undefined) {
//       setFavoriteId(newFavoriteId); // Update the parent state with the new favoriteId
//       toast({ description: message });
//     } else {
//       toast({ description: message });
//     }
//   };

//   return (
//     <form onSubmit={handleToggle}>
//       <CardSubmitButton isFavorite={favoriteId ? true : false} />
//     </form>
//   );
// }

// export default FavoriteToggleForm;
