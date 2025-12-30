import { ReactNode, useState } from "react";
import { Button, Tooltip } from "@fluentui/react-components";
import { Problem, toProblem } from "@seij/common-types";
import { Icon } from "@seij/common-ui-icons";


export function InlineEdit({
  children,
  editor,
  onEditStart,
  onEditOK,
  onEditCancel,
}: {
  children?: ReactNode | ReactNode[] | null;
  editor: ReactNode;
  onEditStart: () => Promise<any>;
  onEditOK: () => Promise<any>;
  onEditCancel: () => Promise<any>;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const [error, setError] = useState<Problem | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  const handleEdit = async () => {
    try {
      setError(null);
      await onEditStart();
      setEditing(true);
    } catch (err) {
      setError(toProblem(err));
    }
  };

  const handleEditOK = async () => {
    try {
      setError(null);
      setPending(true);
      await onEditOK();
      setEditing(false);
      setPending(false);
    } catch (err) {
      setError(toProblem(err));
      setPending(false);
    }
  };
  const handleEditCancel = async () => {
    try {
      setError(null);
      setPending(true);
      await onEditCancel();
      setEditing(false);
      setPending(false);
    } catch (err: any) {
      setError(toProblem(err));
      setPending(false);
    }
  };

  if (!editing)
    return (
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div>{children}</div>
        <div>
          <Tooltip content="Large with calendar icon only" relationship="label">
            <Button size="small" icon={<Icon name="edit" />} onClick={handleEdit} />
          </Tooltip>
        </div>
      </div>
    );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div>{editor}</div>
        <div>
          <Button disabled={pending} onClick={handleEditOK}>
            OK
          </Button>
        </div>
        <div>
          <Button disabled={pending} onClick={handleEditCancel}>
            Cancel
          </Button>
        </div>
      </div>
      {error && <div style={{ color: "red" }}>{error.title}</div>}
    </div>
  );
}
