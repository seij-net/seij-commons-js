import { Hamburger, makeStyles, tokens, Tooltip } from "@fluentui/react-components";
const useApplicationShellStyles = makeStyles({
  bugerIcon: {
    color: tokens.colorNeutralForegroundOnBrand,
    ":hover": {
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});
export const MenuBurger = ({ onClick }: { onClick: () => void }) => {
  const styles = useApplicationShellStyles();
  return (
    <Tooltip content="Navigation" relationship="label">
      <Hamburger className={styles.bugerIcon} onClick={onClick} />
    </Tooltip>
  );
};
