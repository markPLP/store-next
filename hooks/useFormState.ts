import { useState } from 'react';
import { actionFunction } from '@/utils/types';

export function useFormState<T>(
  action: actionFunction,
  initialState: T
): [T, boolean, (formData: FormData) => Promise<void>] {
  const [state, setState] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submitting state

  const formAction = async (formData: FormData) => {
    setIsSubmitting(true); // Set to true when submitting
    try {
      const result = await action(state, formData);
      setState((prevState) => ({ ...prevState, ...result }));
    } catch (error) {
      console.error('Error in formAction:', error);
      setState((prevState) => ({ ...prevState, message: 'An error occurred' }));
    } finally {
      setIsSubmitting(false); // Set to false when done submitting
    }
  };

  return [state, isSubmitting, formAction]; // Return isSubmitting as part of the hook
}
