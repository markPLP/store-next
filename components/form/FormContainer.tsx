'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { actionFunction } from '@/utils/types';
import { useFormState } from '@/hooks/useFormState'; // Use the custom hook

const initialState = {
  message: '',
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, isSubmitting, formAction] = useFormState(action, initialState); // Include `isSubmitting`
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    await formAction(formData); // Trigger the custom hook's formAction
  };

  useEffect(() => {
    if (state.message) {
      console.log('State message:', state.message);
      toast({ description: state.message });
    }
  }, [state.message, toast]);

  return <form onSubmit={handleSubmit}>{children}</form>;
}

export default FormContainer;
