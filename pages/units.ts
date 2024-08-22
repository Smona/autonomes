import { joules, kilograms, Measure } from "safe-units";

export const Calories = Measure.of(4184, joules, "Calories");
export const CalPerKg = Measure.of(1, Calories)
  .over(Measure.of(1, kilograms))
  .withSymbol("Cal/kg");
