import classNames from "classnames";
interface RadioProps {
  label: string;
  value: string;
  isSelected: boolean;
  onChange: (value: string) => void;
}

export const Radio = ({ label, value, isSelected, onChange }: RadioProps) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          name="price"
          value={value}
          checked={isSelected}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        <div
          className={`
          w-4 h-4 rounded-full border-2 transition-all duration-200
          ${
            isSelected
              ? "border-primary bg-primary"
              : "border-gray-300 bg-white hover:border-primary"
          }
        `}
        >
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      <span
        className={classNames("ml-3 transition-colors duration-200", {
          "text-primary font-medium": isSelected,
          "text-text-primary": !isSelected,
        })}
      >
        {label}
      </span>
    </label>
  );
};
