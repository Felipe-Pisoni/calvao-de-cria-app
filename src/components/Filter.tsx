import { Radio } from "./Radio";

interface FilterProps {
  selectedPrice: string;
  onPriceChange: (value: string) => void;
}

interface PriceRange {
  label: string;
  value: string;
}

const FILTER_PRICE_RANGES: PriceRange[] = [
  { label: "Todos os preços", value: "" },
  { label: "Até R$40", value: "0-40" },
  { label: "R$40 A R$60", value: "40-60" },
  { label: "R$60 A R$100", value: "60-100" },
  { label: "R$100 A R$200", value: "100-200" },
  { label: "R$200 A R$500", value: "200-500" },
  { label: "Acima de R$500", value: "500+" },
];
export const Filter = ({ selectedPrice, onPriceChange }: FilterProps) => {
  return (
    <div className="hidden md:flex flex-col gap-4">
      <span className="text-xl">Refine sua busca</span>
      <span className="text-lg">Por preço</span>
      <div className="flex flex-col gap-2">
        {FILTER_PRICE_RANGES.map((item) => (
          <Radio
            key={item.value}
            label={item.label}
            value={item.value}
            isSelected={selectedPrice === item.value}
            onChange={onPriceChange}
          />
        ))}
      </div>
    </div>
  );
};
