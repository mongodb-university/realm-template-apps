import {useReducer} from 'react';

// This forces a rerender
// https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
export const useRerender = () => {
  const [, rerender] = useReducer(x => x + 1, 0);

  return rerender;
};
