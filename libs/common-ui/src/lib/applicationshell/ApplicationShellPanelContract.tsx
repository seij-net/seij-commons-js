import { Button, Tooltip } from "@fluentui/react-components";
import { Icon } from "@seij/common-ui-icons";

export const PanelLeftContract = ({
  panelState,
  onClick,
}: {
  panelState: "expanded" | "rails";
  onClick: () => void;
}) => {
  return (
    <Tooltip content="Reduce panel" relationship="label">
      <Button
        onClick={onClick}
        icon={<Icon name={panelState === "expanded" ? "panel_left_reduce" : "panel_left_expand"} />}
        size="medium"
        appearance="subtle"
      />
    </Tooltip>
  );
};
