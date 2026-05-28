import { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';

export function useAxios() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useAxios trebuie folosit in interiorul ApiProvider.');
  }

  return context;
}
