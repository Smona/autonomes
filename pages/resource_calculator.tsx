import { HTMLProps, useState } from "react";

type ResourceConfig = {
  unit: string;
};

enum Resource {
  Food,
  Water,
  Electricity,
}

const resources: Record<Resource, ResourceConfig> = {
  [Resource.Electricity]: {
    unit: "KW",
  },
  [Resource.Food]: {
    unit: "Calories",
  },
  [Resource.Water]: {
    unit: "L",
  },
};

type Budget = Partial<Record<Resource, number>>;

const MaleAdultBudget: Budget = {
  // Source: https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256
  [Resource.Water]: 3.7,
  // Source: https://blog.mercy.com/daily-calorie-intake/
  [Resource.Food]: 2600,
};

const FemaleAdultBudget: Budget = {
  // Source: https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256
  [Resource.Water]: 2.7,
  // Source: https://blog.mercy.com/daily-calorie-intake/
  [Resource.Food]: 2300,
};

interface NumberInputProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value?: number;
  label?: string;
  onChange?: (value: number) => any;
}

function NumberInput({ label, onChange, ...etc }: NumberInputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        type="number"
        {...etc}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}

export default function ResourceCalculator() {
  const [males, setMales] = useState(1);
  const [females, setFemales] = useState(1);

  return (
    <div>
      <NumberInput
        label="Male residents"
        value={males}
        onChange={setMales}
        min={1}
        step={1}
      />
      <NumberInput
        label="Female residents"
        value={females}
        onChange={setFemales}
        min={1}
        step={1}
      />
    </div>
  );
}
