'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { actionFunction } from '@/utils/types';

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
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      console.log('State message:', state.message);
      toast({ description: state.message }); // Ensure proper integration
    }
  }, [state.message, toast]); // Dependency array for specific state.message updates

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;
