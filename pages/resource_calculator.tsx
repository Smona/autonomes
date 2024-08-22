import { HTMLProps, useEffect, useMemo, useState } from "react";
import {
  GenericMeasure,
  liters,
  joules,
  Measure,
  Volume,
  Energy,
  Power,
  days,
  hours,
  VolumetricFlow,
  kilograms,
  grams,
} from "safe-units";
import { Calories, CalPerKg } from "./units";
import { v4 } from "uuid";
import food_data from "../data/usda_food_data/FoodData_Central_foundation_food_json_2021-10-28.json";

console.log(food_data);

type ResourceConfig = {
  unit: string;
};

const resources = {
  electricity: {
    unit: "KW",
  },
  food: {
    unit: "Calories",
  },
  water: {
    unit: "L",
  },
} as const;

type Resource = keyof typeof resources;

type Budget = {
  water?: VolumetricFlow;
  food?: Power;
};

const MaleAdultBudget = {
  // Source: https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256
  water: Measure.of(3.7, liters).per(days),
  // Source: https://blog.mercy.com/daily-calorie-intake/
  food: Measure.of(2600, Calories).per(days),
};

const FemaleAdultBudget = {
  // Source: https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256
  water: Measure.of(2.7, liters).per(days),
  // Source: https://blog.mercy.com/daily-calorie-intake/
  food: Measure.of(2300, Calories).per(days),
};

interface NumberInputProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value?: number;
  label?: string;
  onChange?: (value: number) => any;
}

function NumberInput({ label, onChange, ...etc }: NumberInputProps) {
  return (
    <span>
      {label && <label>{label}</label>}
      <input
        type="number"
        {...etc}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </span>
  );
}

// type GeneratorData {
//   demands:
// }

// class Generator {
//   static load(id: string) {
//     const data = localStorage.getItem(id);
//     if (!data) throw new Error("Generator not found")
//     return new Generator(JSON.parse(data), id);
//   }

//   static loadAll() {
//     const ids = localStorage.getItem("generators");
//     if (!ids) return [];
//     return JSON.parse(ids).map((id: string) => Generator.load(id));
//   }

//   private id: string;
//   private demands: Budget;
//   private produces: Budget;

//   constructor(data: GeneratorData, id?: string) {
//     this.id = id || v4();
//   }

//   save() {
//     const ids = localStorage.getItem("generators") || '[]';
//     const idsArray = JSON.parse(ids);
//     idsArray.push(this.id);
//     localStorage.setItem("generators", JSON.stringify(idsArray));
//     localStorage.setItem(this.id, JSON.stringify(this.data));
//   }
// }

const CaloricDensity = {
  // Source: USDA
  flour: Measure.of(3640, Calories).per(kilograms),
  carrots: Measure.of(410, Calories).per(kilograms),
  grapes: Measure.of(674, Calories).per(kilograms),
  potatoes: Measure.of(765, Calories).per(kilograms),
};

const day = Measure.of(1, days);

async function load() {
  const people = JSON.parse(localStorage.getItem("people") || "[]");
}

export default function ResourceCalculator() {
  const [inventory, setInventory] = useState<{
    [Property in keyof typeof CaloricDensity]: number;
  }>({
    flour: 10,
    carrots: 5,
    grapes: 0,
    potatoes: 10,
  });
  const [males, setMales] = useState(1);
  const [females, setFemales] = useState(1);

  const caloriesPerDay = MaleAdultBudget.food
    .times(day)
    .scale(males)
    .plus(FemaleAdultBudget.food.times(day).scale(females));
  const waterPerDay = FemaleAdultBudget.water
    .times(day)
    .scale(females)
    .plus(MaleAdultBudget.water.times(day).scale(males));

  const caloriesInventory = Object.keys(inventory).reduce((acc, key) => {
    const calories = Measure.of(
      inventory[key as keyof typeof inventory],
      kilograms
    ).times(CaloricDensity.flour);
    return acc.plus(calories);
  }, Measure.of(0, Calories));

  const daysRemaining = caloriesInventory.over(caloriesPerDay);

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

      <h3>Daily requirements</h3>

      <p>Calories: {caloriesPerDay.in(Calories)}</p>
      <p>Water: {waterPerDay.in(liters)}</p>

      <h3>Inventory</h3>
      <ul>
        {Object.keys(inventory).map((key) => (
          <li>
            {key} ({CaloricDensity[key].in(CalPerKg)}):{" "}
            <NumberInput
              value={inventory[key]}
              onChange={(amount) =>
                setInventory((prev) => ({ ...prev, [key]: amount }))
              }
              step={1}
            />
            kg
          </li>
        ))}
      </ul>

      <p>Calories in inventory: {caloriesInventory.in(Calories)}</p>
      <p>You will run out of food in {daysRemaining.value} days</p>
    </div>
  );
}
