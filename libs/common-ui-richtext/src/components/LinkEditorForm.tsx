import { Button, Input, makeStyles, tokens, type InputOnChangeData } from "@fluentui/react-components";
import { CheckmarkRegular, DeleteRegular, DismissRegular, EditRegular } from "@fluentui/react-icons";
import { type KeyboardEvent, type MouseEvent, useEffect, useState } from "react";

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

export function LinkEditorForm({ disabled, url, onCancel, onRemove, onSubmit }: LinkEditorFormProps) {
  const styles = useStyles();
  const [editing, setEditing] = useState(url === "https://");
  const [draftUrl, setDraftUrl] = useState(url || "https://");

  useEffect(() => {
    setEditing(url === "https://");
    setDraftUrl(url || "https://");
  }, [url]);

  const submit = (event: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit(draftUrl.trim());
    setEditing(false);
  };

  const cancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDraftUrl(url || "https://");
    onCancel();
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className={styles.root}>
        <a className={styles.link} href={url} rel="noopener noreferrer" target="_blank">
          {url}
        </a>
        <Button
          aria-label="Edit link"
          appearance="subtle"
          disabled={disabled}
          icon={<EditRegular />}
          onClick={(event) => {
            event.preventDefault();
            setDraftUrl(url);
            setEditing(true);
          }}
          size="small"
        />
        <Button
          aria-label="Remove link"
          appearance="subtle"
          disabled={disabled}
          icon={<DeleteRegular />}
          onClick={onRemove}
          size="small"
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Input
        aria-label="Link URL"
        autoFocus
        className={styles.input}
        disabled={disabled}
        onChange={(_event, data: InputOnChangeData) => setDraftUrl(data.value)}
        onFocus={(event) => event.target.select()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            submit(event);
          } else if (event.key === "Escape") {
            setDraftUrl(url || "https://");
            onCancel();
            setEditing(false);
          }
        }}
        size="small"
        value={draftUrl}
      />
      <Button
        aria-label="Cancel"
        appearance="subtle"
        disabled={disabled}
        icon={<DismissRegular />}
        onClick={cancel}
        size="small"
      />
      <Button
        aria-label="Apply"
        appearance="primary"
        disabled={disabled}
        icon={<CheckmarkRegular />}
        onClick={submit}
        size="small"
      />
    </div>
  );
}
