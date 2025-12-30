import { Problem } from "@seij/common-types";
import { Button, MessageBar, MessageBarActions, MessageBarBody } from "@fluentui/react-components";
import { isNil } from "lodash-es";
import { useI18n } from "../i18n/i18n.react";
import { Icon } from "@seij/common-ui-icons";

export const ErrorBox = ({ error, onClose }: { error: Problem | null | undefined; onClose?: () => void }) => {
  const { t } = useI18n();

  if (!error) return null;
  const regularMessage =
    error.title ??
    t("errorbox_unknown_error", { error: error.status ? "" + error.status : t("errorbox_unknown_error_status") });

  return (
    <MessageBar intent="error" layout="multiline">
      <MessageBarBody>
        <div>{regularMessage}</div>
        <div>{error.detail}</div>
      </MessageBarBody>
      {!isNil(onClose) && (
        <MessageBarActions
          containerAction={<Button appearance="transparent" icon={<Icon name="dismiss" />} onClick={onClose} />}
        ></MessageBarActions>
      )}
    </MessageBar>
  );
};
