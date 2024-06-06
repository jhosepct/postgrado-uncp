import { useCallback, useEffect, useState } from 'react';

export const useSelection = (items = []) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]); // Resetea la selección cuando `items` cambie
  }, [items]);

  const handleSelectAll = useCallback(() => {
    setSelected(items); // Selecciona todos los items
  }, [items]);

  const handleSelectOne = useCallback((item) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(item)) {
        return prevSelected; // Si el item ya está seleccionado, no hagas nada
      }
      return [...prevSelected, item]; // Agrega el item a la selección
    });
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelected([]); // Deselecciona todos los items
  }, []);

  const handleDeselectOne = useCallback((item) => {
    setSelected((prevSelected) => {
      return prevSelected.filter((_item) => _item !== item); // Filtra el item a deseleccionar
    });
  }, []);

  return {
    handleDeselectAll,
    handleDeselectOne,
    handleSelectAll,
    handleSelectOne,
    selected
  };
};
