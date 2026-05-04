import { Button, Input, type InputOnChangeData, makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { CheckmarkRegular, DeleteRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  type MouseEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useRichTextI18n } from "../../utils/useRichTextI18n";

const linkFormWidth = 320;

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    columnGap: tokens.spacingHorizontalXS,
    display: "flex",
    width: `${linkFormWidth}px`,
  },
  input: {
    flexGrow: 1,
    minWidth: 0,
  },
  link: {
    color: tokens.colorBrandForegroundLink,
    flexGrow: 1,
    minWidth: 0,
    overflowX: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

export interface LinkEditorFormProps {
  disabled: boolean;
  url: string;
  onCancel: () => void;
  onRemove: () => void;
  onSubmit: (url: string) => void;
}

/**
 * A form to edit a link. It is displayed inside a popup element.
 *
 * If the URL is just "https://" with nothing behind, we consider we are
 * in an editing mode.
 */
export function LinkEditorForm({ disabled, url, onCancel, onRemove, onSubmit }: LinkEditorFormProps) {
  const styles = useStyles();
  const [editing, setEditing] = useState(url === "https://");
  const [draftUrl, setDraftUrl] = useState(url || "https://");
  const { t } = useRichTextI18n();

  useEffect(() => {
    setEditing(url === "https://");
    setDraftUrl(url || "https://");
  }, [url]);

  const linkEditButtonLabel = t("linkEditButton");
  const linkRemoveButtonLabel = t("linkRemoveButton");
  const linkUrlInputLabel = t("linkUrlInput");
  const linkCancelButtonLabel = t("linkCancelButton");
  const linkApplyButtonLabel = t("linkApplyButton");

  const validateValue = () => {
    onSubmit(draftUrl.trim());
    setEditing(false);
  };
  const handleClickOK = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validateValue();
  };
  const handleClickCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDraftUrl(url || "https://");
    onCancel();
    setEditing(false);
  };

  const handleClickEdit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setDraftUrl(url);
    setEditing(true);
  };

  const handleClickRemove: MouseEventHandler<HTMLButtonElement> = () => onRemove();
  const handleChangeLinkValue = (_event: ChangeEvent, data: InputOnChangeData) => setDraftUrl(data.value);
  const handleFocusLinkValue: FocusEventHandler<HTMLInputElement> = (event) => event.target.select();
  const handleKeydownLinkValue: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      validateValue();
    } else if (event.key === "Escape") {
      setDraftUrl(url || "https://");
      onCancel();
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <div className={styles.root}>
        <a className={styles.link} href={url} rel="noopener noreferrer" target="_blank">
          {url}
        </a>
        <Tooltip content={linkEditButtonLabel} relationship={"description"} withArrow>
          <Button
            aria-label={linkEditButtonLabel}
            appearance="subtle"
            disabled={disabled}
            icon={<EditRegular />}
            onClick={handleClickEdit}
            size="small"
          />
        </Tooltip>
        <Tooltip content={linkRemoveButtonLabel} relationship={"description"} withArrow>
          <Button
            aria-label={linkRemoveButtonLabel}
            appearance="subtle"
            disabled={disabled}
            icon={<DeleteRegular />}
            onClick={handleClickRemove}
            size="small"
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Input
        aria-label={linkUrlInputLabel}
        autoFocus
        className={styles.input}
        disabled={disabled}
        onChange={handleChangeLinkValue}
        onFocus={handleFocusLinkValue}
        onKeyDown={handleKeydownLinkValue}
        size="small"
        value={draftUrl}
      />
      <Button
        aria-label={linkCancelButtonLabel}
        appearance="subtle"
        disabled={disabled}
        icon={<DismissRegular />}
        onClick={handleClickCancel}
        size="small"
      />
      <Button
        aria-label={linkApplyButtonLabel}
        appearance="primary"
        disabled={disabled}
        icon={<CheckmarkRegular />}
        onClick={handleClickOK}
        size="small"
      />
    </div>
  );
}
