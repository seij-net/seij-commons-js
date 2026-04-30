import { Button, Tooltip } from "@fluentui/react-components";
import { Icon } from "@seij/common-ui-icons";

export const PanelLeftContract = ({
  panelState,
  onClick,
}: {
  panelState: "expanded" | "rails";
  onClick: () => void;
}) => {
  const label = panelState == "rails" ? "Expand panel" : "Reduce panel"
  return (
    <Tooltip content={label} relationship="label">
      <Button
        onClick={onClick}
        icon={<Icon name={panelState === "expanded" ? "panel_left_reduce" : "panel_left_expand"} />}
        size="medium"
        appearance="subtle"
      />
    </Tooltip>
  );
};
