'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { actionFunction } from '@/utils/types';

const initialState = {
  message: '',
};

// type FormContainerProps = {
//   action: actionFunction;
//   children: React.ReactNode;
// };

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
      toast({ description: state.message, duration: 1500 });
    }
  }, [state, toast]);

  return <form action={formAction as unknown as string}>{children}</form>;

  // ISSUE: .action?: string | undefined
  // NOTE: action` attribute expects a string URL, but we're passing a function for React Server Actions. We can use a TypeScript assertion to tell the compiler that our usage is intentional and correct.
  // SOLUTION: tell TS compiler that our usage is intentional and correct.
  // use assertion 'as unknown as string'
}
export default FormContainer;
// In the FormContainer component, we have a form element that takes an action prop. The action prop is a function that returns a Promise. When the form is submitted, the action function is called with the form data, and the result is stored in the state. We then use the state to display a toast message.
