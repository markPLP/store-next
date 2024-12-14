import 'react-dom';

import { actionFunction } from '@/utils/types';

declare module 'react' {
  export function useFormState<T>(
    action: actionFunction,
    initialState: T
  ): [T, (formData: FormData) => Promise<void>];
}

// declare module 'react-dom' {
//   function experimental_useFormState<State>(
//     action: (state: State) => Promise<State>,
//     initialState: State,
//     permalink?: string
//   ): [state: State, dispatch: () => void];
// function experimental_useFormState<State, Payload>(
//   action: (state: State, payload: Payload) => Promise<State>,
//   initialState: State,
//   permalink?: string
// ): [state: State, dispatch: (payload: Payload) => void];
//}
