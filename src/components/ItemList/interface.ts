export interface Item {
  id: string | number;
  label: string;
}

export interface ItemListProps {
  items: Item[];
  onSelectItem?: (item: Item) => void;
  selectedItemId?: string | number;
}
