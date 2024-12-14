'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormState } from '@/hooks/useFormState'; // Use the custom hook
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { actionFunction } from '@/utils/types'; // Ensure actionFunction type is imported

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
  action?: actionFunction; // Make action optional
  initialState?: { message: string }; // Make initialState optional
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
  action = () => Promise.resolve({ message: '' }), // Default no-op action
  initialState = { message: '' }, // Default initial state
}: SubmitButtonProps) {
  // Pass action and initialState to useFormState
  const [state, isSubmitting] = useFormState(action, initialState);
  console.log('isSubmitting', isSubmitting);

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn('capitalize', className)}
      size={size}
    >
      {isSubmitting ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}
