
import { useState, useCallback } from 'react';

interface UseCreateLibraryLogicProps {
  onCreate: (name: string) => void;
  onClose: () => void;
}

/**
 * 新建书库业务逻辑 Hook
 */
export const useCreateLibraryLogic = ({
  onCreate,
  onClose
}: UseCreateLibraryLogicProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    if (value.trim()) {
      setError(false);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(true);
      return;
    }
    
    onCreate(trimmedName);
    setName('');
    setError(false);
    onClose();
  }, [name, onCreate, onClose]);

  return {
    name,
    error,
    handleNameChange,
    handleSubmit
  };
};
