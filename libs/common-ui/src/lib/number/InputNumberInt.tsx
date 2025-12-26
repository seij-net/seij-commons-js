import { InputNumber, InputNumberProps } from "./InputNumber";

export interface InputNumberIntProps extends InputNumberProps {
  /**
   * Unité à afficher.
   *
   * Si renseignée, elle est prise en compte sinon on prend la devise du contexte.
   * Pour ne pas afficher du tout la devise, il faut passer une chaîne vide.
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
export const InputNumberInt: React.FC<InputNumberIntProps> = (props) => {
  const { unit, allowNegative, ...other } = props;
  return (
    <InputNumber
      decimalScale={0}
      allowNegative={allowNegative ?? false}
      inputMode="numeric"
      thousandSeparator={false}
      size={9}
      unit={unit}
      {...other}
    />
  );
};
