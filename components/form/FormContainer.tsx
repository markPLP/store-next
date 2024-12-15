'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { actionFunction } from '@/utils/types';

const initialState = {
  message: '',
};

type FormContainerProps = {
  action: actionFunction;
  children: React.ReactNode;
};

function FormContainer({ action, children }: FormContainerProps) {
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();
  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
  }, [state, toast]);

  return <form action={formAction as unknown as string}>{children}</form>;
  // ISSUE: .action?: string | undefined
  // NOTE: action` attribute expects a string URL, but we're passing a function for React Server Actions. We can use a TypeScript assertion to tell the compiler that our usage is intentional and correct.
  // SOLUTION: tell TS compiler that our usage is intentional and correct.
  // use assertion 'as unknown as string'
}
export default FormContainer;
