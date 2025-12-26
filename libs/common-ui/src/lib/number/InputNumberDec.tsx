import { InputNumber, InputNumberProps } from "./InputNumber";

export interface InputNumberDecProps extends InputNumberProps {
  /**
   * Unité d'affichage
   */
  unit?: string;
  /**
   * Si on supprte les valeurs négatiges (par défaut false)
   */
  allowNegative?: boolean;
}

/**
 * Un input special annee.
 */
export const InputNumberDec: React.FC<InputNumberDecProps> = (props) => {
  const { unit, allowNegative, ...other } = props;
  return (
    <InputNumber
      decimalScale={2}
      allowNegative={allowNegative ?? false}
      inputMode="decimal"
      thousandSeparator={false}
      size={9}
      unit={unit}
      {...other}
    />
  );
};
