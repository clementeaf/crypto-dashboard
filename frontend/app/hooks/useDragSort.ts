/**
 * Hook personalizado para la funcionalidad de arrastrar y soltar
 */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getCardOrder, saveCardOrder } from '~/utils/storage';
import type { Cryptocurrency } from '~/types/crypto';

interface UseDragSortOptions {
  initialItems: Cryptocurrency[];
  persistKey?: string;
}

interface UseDragSortReturn {
  items: Cryptocurrency[];
  draggedItemIndex: number | null;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  reorderItems: (orderedIds: string[]) => void;
}

/**
 * Hook para manejar la funcionalidad de arrastrar y soltar para reordenar elementos
 */
export function useDragSort({ initialItems }: UseDragSortOptions): UseDragSortReturn {
  const [items, setItems] = useState<Cryptocurrency[]>(initialItems);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  
  // Referencia para comparar si initialItems ha cambiado realmente
  const initialItemsRef = useRef<string[]>([]);
  
  // Actualizar items cuando initialItems cambia significativamente
  useEffect(() => {
    // Creamos un array de IDs para comparar de forma eficiente
    const currentIds = initialItems.map(item => item.id);
    const previousIds = initialItemsRef.current;
    
    // Verificamos si hay diferencias entre los IDs actuales y anteriores
    const hasChanged = 
      currentIds.length !== previousIds.length ||
      currentIds.some((id, index) => previousIds[index] !== id);
    
    if (hasChanged) {
      // Actualizamos la referencia
      initialItemsRef.current = currentIds;
      
      // Si hay orden guardado, lo aplicamos a los nuevos items
      const savedOrder = getCardOrder();
      if (savedOrder && savedOrder.length > 0) {
        // Reordenar según el orden guardado
        const itemsMap = new Map(initialItems.map(item => [item.id, item]));
        const orderedItems: Cryptocurrency[] = [];
        
        // Primero agregamos los que tienen orden guardado
        savedOrder.forEach(id => {
          if (itemsMap.has(id)) {
            orderedItems.push(itemsMap.get(id)!);
            itemsMap.delete(id);
          }
        });
        
        // Luego agregamos los restantes
        itemsMap.forEach(item => orderedItems.push(item));
        
        setItems(orderedItems);
      } else {
        // Si no hay orden guardado, usamos los initialItems directamente
        setItems(initialItems);
      }
    }
  }, [initialItems]);

  /**
   * Reordena los elementos según una lista de IDs
   */
  const reorderItems = useCallback((orderedIds: string[]) => {
    setItems(prevItems => {
      // Crea un mapa de los items actuales por ID para acceso rápido
      const itemsMap = new Map(prevItems.map(item => [item.id, item]));
      
      // Filtrar IDs que no existen en los items actuales
      const validOrderedIds = orderedIds.filter(id => itemsMap.has(id));
      
      // Obtener items que están en la lista pero no en orderedIds
      const remainingItems = prevItems.filter(item => !validOrderedIds.includes(item.id));
      
      // Reordenar los items según orderedIds y añadir los restantes al final
      const reorderedItems = [
        ...validOrderedIds.map(id => itemsMap.get(id)!),
        ...remainingItems
      ];
      
      // Persistir el nuevo orden
      saveCardOrder(reorderedItems.map(item => item.id));
      
      return reorderedItems;
    });
  }, []);

  /**
   * Maneja el inicio del arrastre
   */
  const handleDragStart = useCallback((index: number) => {
    setDraggedItemIndex(index);
  }, []);

  /**
   * Maneja cuando un elemento está siendo arrastrado sobre otro
   */
  const handleDragEnter = useCallback((index: number) => {
    setDragOverItemIndex(index);
  }, []);

  /**
   * Previene el comportamiento por defecto del evento dragover
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  /**
   * Maneja el final del arrastre, reordenando los elementos
   */
  const handleDragEnd = useCallback(() => {
    if (draggedItemIndex === null || dragOverItemIndex === null) {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
      return;
    }

    setItems(prevItems => {
      const itemsCopy = [...prevItems];
      const draggedItem = itemsCopy[draggedItemIndex];
      
      // Eliminar el elemento arrastrado de su posición original
      itemsCopy.splice(draggedItemIndex, 1);
      
      // Insertar el elemento en la nueva posición
      itemsCopy.splice(dragOverItemIndex, 0, draggedItem);
      
      // Guardar el nuevo orden
      saveCardOrder(itemsCopy.map(item => item.id));
      
      return itemsCopy;
    });
    
    // Resetear los estados de arrastre
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  }, [draggedItemIndex, dragOverItemIndex]);

  // Memoizar el objeto de retorno para evitar renderizados innecesarios
  return useMemo(() => ({
    items,
    draggedItemIndex,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
    reorderItems,
  }), [
    items, 
    draggedItemIndex, 
    handleDragStart, 
    handleDragEnter, 
    handleDragEnd, 
    handleDragOver, 
    reorderItems
  ]);
} 