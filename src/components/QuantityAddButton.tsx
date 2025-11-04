interface QuantityAddButtonProps {
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onAdd?: () => void;
  disabled?: boolean;
}

export const QuantityAddButton = ({
  quantity,
  onQuantityChange,
  onAdd,
  disabled = false,
}: QuantityAddButtonProps) => {
  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    }
  };

  return (
    <div className={`bg-primary rounded-lg flex items-center text-white font-semibold overflow-hidden ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}>
      <button
        onClick={() => !disabled && onQuantityChange(-1)}
        disabled={disabled || quantity <= 1}
        className="px-4 py-3 hover:bg-opacity-80 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <span className="px-4 py-3 text-lg font-semibold">
        {quantity}
      </span>
      
      <button
        onClick={() => !disabled && onQuantityChange(1)}
        disabled={disabled}
        className="px-4 py-3 hover:bg-opacity-80 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      <button
        onClick={handleAddClick}
        disabled={disabled}
        className="flex-1 text-center py-3 text-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Adicionar
      </button>
    </div>
  );
};