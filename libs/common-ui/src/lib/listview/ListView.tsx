import {
  Caption1,
  Card,
  CardHeader,
  Input,
  List,
  ListItem,
  makeStyles,
  Text,
  tokens,
} from "@fluentui/react-components";
import { ChevronRightFilled, SearchRegular } from "@fluentui/react-icons";
import { isFunction } from "lodash-es";
import { ReactNode } from "react";
import { useI18n } from "../i18n/i18n.react";

export interface ListItemData {
  id: string;
  label: ReactNode;
  description: ReactNode | null;
}

const useStyles = makeStyles({
  noresult: {
    textAlign: "center",
    padding: "1em",
  },
});
export interface ListViewProps<T extends ListItemData = ListItemData> {
  data: T[];
  activeId: string;
  searchText?: string;
  search?: (input: string) => void;
  pathFactory: (item: T) => string;
  navigate: (url: string) => void;
}
export function ListView<T extends ListItemData>({
  data,
  activeId,
  searchText = "",
  search,
  pathFactory,
  navigate,
}: ListViewProps<T>) {
  const styles = useStyles();
  const { t } = useI18n();
  const handleChange = (value: string) => {
    if (search) search(value);
  };
  const isSearchEnabled = isFunction(search);
  const searchMessage = t("ListView_search");
  const noResultMessage = t("ListView_no_result");
  return (
    <div>
      {isSearchEnabled && (
        <Input
          style={{ width: "100%" }}
          contentBefore={<SearchRegular aria-label={searchMessage} />}
          value={searchText}
          placeholder={searchMessage}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
      <div>
        <ItemList activeId={activeId} items={data} pathFactory={pathFactory} navigate={navigate} />
      </div>
      {data.length === 0 ? (
        <div className={styles.noresult}>
          <Caption1>{noResultMessage}</Caption1>
        </div>
      ) : null}
    </div>
  );
}

const useItemListStyles = makeStyles({
  root: {
    display: "flex",
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
  },
  description: {
    fontWeight: "normal",
  },
  action: {
    flex: 0,
  },

  card: {
    width: "100%",
    borderBottom: "1px solid " + tokens.colorNeutralStencil1,
    borderRadius: tokens.borderRadiusNone,
  },
});

function ItemList<T extends ListItemData>({
  items,
  activeId,
  pathFactory,
  navigate,
}: {
  items: T[];
  activeId: string;
  pathFactory: (item: T) => string;
  navigate: (url: string) => void;
}) {
  const style = useItemListStyles();
  if (items.length === 0) return null;
  return (
    <List navigationMode="composite">
      {items.map((it) => (
        <ListItem
          key={it.id}
          onAction={() => {
            navigate(pathFactory(it));
          }}
        >
          <Card
            role="gridcell"
            orientation="horizontal"
            appearance="subtle"
            className={style.card}
            onClick={() => {
              navigate(pathFactory(it));
            }}
          >
            <CardHeader
              header={<Text weight="regular">{it.label ?? <span>&nbsp;</span>}</Text>}
              description={<Caption1>{it.description ?? <span>&nbsp;</span>}</Caption1>}
              action={<ChevronRightFilled />}
            />
          </Card>
        </ListItem>
      ))}
    </List>
  );
}
