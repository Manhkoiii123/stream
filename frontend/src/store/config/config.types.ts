import { TypeBaseColor } from "@/lib/constants/color.constants";

export interface ConfigStore {
  theme: TypeBaseColor;
  setTheme: (theme: TypeBaseColor) => void;
}
