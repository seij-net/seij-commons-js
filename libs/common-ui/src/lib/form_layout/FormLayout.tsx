import { InfoLabel, makeResetStyles, makeStyles, tokens, typographyStyles } from "@fluentui/react-components";
import { isEmpty, isString } from "lodash-es";
import { createContext, ReactElement, ReactNode, useContext } from "react";
import { obfuscateLabel } from "../commons/obfuscatelabel";
import { SectionTitle } from "../typography/sectiontitle/SectionTitle";
import { SwitchButton } from "../switchbutton/SwitchButton";

const useStylesFormLayout = makeStyles({
  fluid: {
    display: "flex",
    flexDirection: "column",
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalM,
  },
  table: {
    display: "grid",
    gridTemplateColumns: "max-content auto",
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalM,
  },
});

export type FormLayoutType = "fluid" | "table";
type FormLayoutCtxProps = {
  type: FormLayoutType;
};
const FormLayoutCtx = createContext<FormLayoutCtxProps>({ type: "fluid" });

export function FormLayout({ children, variant = "fluid" }: { variant?: FormLayoutType; children: ReactNode }) {
  const style = useStylesFormLayout();

  const styles = variant === "fluid" ? style.fluid : style.table;
  return (
    <FormLayoutCtx.Provider value={{ type: variant }}>
      <div className={styles}>{children}</div>
    </FormLayoutCtx.Provider>
  );
}

export function FormLayoutTable({ children }: { children: ReactNode }) {
  return <FormLayout variant="table">{children}</FormLayout>;
}

// -----------------------------------------------------------------------------
// Champ de formulaire
// -----------------------------------------------------------------------------

export type FormFieldHintPosition = "inline" | "infobutton";

const useFormFieldStyles = makeStyles({
  childrenFluidArea: {
    "> *": {
      width: "100%",
    },
  },
});

export function FormField({
  label,
  hint,
  children,
  hintPosition = "infobutton",
}: {
  label: string | ReactNode;
  hint?: ReactNode;
  children: ReactElement;
  hintPosition?: FormFieldHintPosition;
}) {
  const ctx = useContext(FormLayoutCtx);
  const styles = useFormFieldStyles();
  const infoButtonContent = hint && label && hintPosition === "infobutton" ? hint : null;
  const infoInline = hint && (!label || hintPosition === "inline") ? <Hint>{hint}</Hint> : null;

  const labelSafe = isString(label) && !isEmpty(label) ? obfuscateLabel(label) : label;

  if (ctx.type === "table") {
    return (
      <>
        <FormFieldLabel horizontal infoButton={infoButtonContent}>
          {labelSafe}
        </FormFieldLabel>
        <div>
          {children}
          {infoInline}
        </div>
      </>
    );
  }

  if (children && children.type === SwitchButton) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
        <div>{children}</div>
        <div>
          <FormFieldLabel horizontal infoButton={infoButtonContent}>
            {labelSafe}
          </FormFieldLabel>
          {infoInline}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <FormFieldLabel horizontal infoButton={infoButtonContent}>
          {labelSafe}
        </FormFieldLabel>
      </div>
      <div className={styles.childrenFluidArea}>{children}</div>
      {infoInline}
    </div>
  );
}

// Label d'un champ de formulaire
// -----------------------------------------------------------------------------

const useFormFieldLabelStyles = makeStyles({
  vertical: {
    paddingTop: tokens.spacingVerticalXXS,
    paddingBottom: tokens.spacingVerticalXXS,
    marginBottom: tokens.spacingVerticalXXS,
    ...typographyStyles.body1,
  },
  horizontal: {
    paddingTop: tokens.spacingVerticalSNudge,
    paddingBottom: tokens.spacingVerticalSNudge,
    marginRight: tokens.spacingHorizontalM,
    ...typographyStyles.body1,
  },
});

const FormFieldLabel = ({
  horizontal = false,
  infoButton,
  children,
}: {
  horizontal?: boolean;
  infoButton: ReactNode;
  children: ReactNode;
}) => {
  const styles = useFormFieldLabelStyles();
  const className = horizontal ? styles.horizontal : styles.vertical;
  // return <div className={className}>{children}</div>;
  return infoButton ? <InfoLabel info={infoButton}>{children}</InfoLabel> : <div className={className}>{children}</div>;
  // return <InfoLabel>{children}</InfoLabel>
};

// Hint d'un champ de formulaire
// -----------------------------------------------------------------------------
const useHintStyle = makeResetStyles({
  marginTop: tokens.spacingVerticalXXS,
  color: tokens.colorNeutralForeground3,
  ...typographyStyles.caption1,
});

const Hint = ({ children }: { children: ReactNode }) => {
  const className = useHintStyle();
  return <div className={className}>{children}</div>;
};

// -----------------------------------------------------------------------------
// Séparation des formulaires
// -----------------------------------------------------------------------------

export function FormSectionTitle({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <div style={{ gridColumn: "span 2" }}>
      <SectionTitle>{children}</SectionTitle>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Texte read-ony a la place d'un champ de saisie
// -----------------------------------------------------------------------------
export function FormText({ children }: { children: ReactNode }) {
  return (
    <FormFieldLabel infoButton={null} horizontal>
      {children}
    </FormFieldLabel>
  );
}
