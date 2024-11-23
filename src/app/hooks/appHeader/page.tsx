import { StorageService } from '@/services/StorageService';
import { useCallback, useMemo } from 'react';

export const useAppHeader = () => {
  const updateTitle = useCallback((updatedTitle: string) => {
    StorageService.PageTitle.setValue(updatedTitle);
    window.dispatchEvent(new Event('storage'));
  }, []);

  const getTitle = useCallback(() => {
    return StorageService.PageTitle.getValue();
  }, []);

  const values = useMemo(() => {
    return {
      getTitle,
      updateTitle,
    };
  }, [getTitle, updateTitle]);

  return values;
};
