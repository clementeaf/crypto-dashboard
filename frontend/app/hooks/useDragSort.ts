/**
 * Hook personalizado para la funcionalidad de arrastrar y soltar
 */
import { useState, useCallback, useEffect } from 'react';
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

  // Cargar el orden guardado al inicializar
  useEffect(() => {
    if (initialItems.length === 0) return;
    
    const savedOrder = getCardOrder();
    if (!savedOrder) return;
    
    // Reordenar los elementos según el orden guardado
    reorderItems(savedOrder);
  }, [initialItems]);

  /**
   * Reordena los elementos según una lista de IDs
   */
  const reorderItems = useCallback((orderedIds: string[]) => {
    // Crea un mapa de los items actuales por ID para acceso rápido
    const itemsMap = new Map(items.map(item => [item.id, item]));
    
    // Filtrar IDs que no existen en los items actuales
    const validOrderedIds = orderedIds.filter(id => itemsMap.has(id));
    
    // Obtener IDs que están en items pero no en orderedIds
    const remainingItems = items.filter(item => !validOrderedIds.includes(item.id));
    
    // Reordenar los items según orderedIds y añadir los restantes al final
    const reorderedItems = [
      ...validOrderedIds.map(id => itemsMap.get(id)!),
      ...remainingItems
    ];
    
    setItems(reorderedItems);
    
    // Persistir el nuevo orden
    saveCardOrder(reorderedItems.map(item => item.id));
  }, [items]);

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

    const itemsCopy = [...items];
    const draggedItem = itemsCopy[draggedItemIndex];
    
    // Eliminar el elemento arrastrado de su posición original
    itemsCopy.splice(draggedItemIndex, 1);
    
    // Insertar el elemento en la nueva posición
    itemsCopy.splice(dragOverItemIndex, 0, draggedItem);
    
    setItems(itemsCopy);
    
    // Guardar el nuevo orden
    saveCardOrder(itemsCopy.map(item => item.id));
    
    // Resetear los estados de arrastre
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  }, [draggedItemIndex, dragOverItemIndex, items]);

  return {
    items,
    draggedItemIndex,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
    reorderItems,
  };
} 