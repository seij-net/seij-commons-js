import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { isArray } from "lodash-es";
import { HTMLAttributes, ReactElement, useEffect, useRef, useState } from "react";
import { ViewTitle } from "./ViewTitle";
import { ViewBody } from "./ViewBody";
import { ViewFooter } from "./ViewFooter";
import { ViewHeader } from "./ViewHeader";

const DEBUG = false;

const debugTokens = {
  debugBorder: DEBUG ? "1px dotted red" : "none",
};

export type LayoutContentSize = "xsmall" | "small" | "standard" | "large";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    minWidth: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
    marginLeft: tokens.spacingHorizontalL,
    marginRight: tokens.spacingHorizontalL,
    width: "100%",
  },
  contentLarge: {
    maxWidth: "100%",
  },
  contentStandard: {
    maxWidth: "60rem",
  },
  contentSmall: {
    maxWidth: "40rem",
  },
  contentXSmall: {
    maxWidth: "30rem",
  },
  headerWrapper: {
    // Le header prend un minimum de place en hauteur
    flexShrink: 0,
    // Le header ne doit pas scroller mais on réserve quand même une place
    // cachée pour une scrollbar de telle sorte que lorsque le body va scroller
    // si une barre de scroll appraît, le header, body et footer soient toujours
    // alignés
    overflowY: "hidden",
    scrollbarGutter: "stable",
    // Le padding est sur le wrapper pour que lorsque l'écran devient tout petit
    // on aille pas coller les bords de l'écran
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    // Mode debug uniquement
    border: debugTokens.debugBorder,
  },
  header: { margin: "auto" },
  headerWithShadow: {
    //border: "1px solid #ccc",
    boxShadow: tokens.shadow16,
    transition: "box-shadow 0.2s ease-in-out",
    zIndex: 1,
  },
  bodyWrapper: {
    // Le body prend un maximum de place en hauteur
    flexGrow: 1,
    // Le body va scroller mais il faut réserver une place cachée pour la scroll
    // sinon si la scrollbar apparaît elle va désaligner body/header/footer.
    overflowY: "auto",
    scrollbarGutter: "stable",
    // Le padding est sur le wrapper pour que lorsque l'écran devient tout petit
    // on aille pas coller les bords de l'écran
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    // Mode debug uniquement
    border: debugTokens.debugBorder,
  },
  body: {
    margin: "auto",
  },
  footerWrapper: {
    // Le footer prend un minimum de place en hauteur
    flexShrink: 0,
    margin: "auto",
    // Le footer ne doit pas scroller mais on réserve quand même une place
    // cachée pour une scrollbar de telle sorte que lorsque le body va scroller
    // si une barre de scroll appraît, le header, body et footer soient toujours
    // alignés
    overflowY: "hidden",
    scrollbarGutter: "stable",
    // Le padding est sur le wrapper pour que lorsque l'écran devient tout petit
    // on aille pas coller les bords de l'écran
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    // Mode debug uniquement
    border: debugTokens.debugBorder,
  },
  footer: {
    margin: "auto",
  },
});

export type ViewAllowedChild =
  | ReactElement<typeof ViewHeader>
  | ReactElement<typeof ViewTitle>
  | ReactElement<typeof ViewBody>
  | ReactElement<typeof ViewFooter>;

export function ViewLayout({
  children,
  contentSize = "standard",
  ...otherProps
}: {
  /**
   * Indique si on a un contenu de type large ou normal ou small, permet d'adapter la largeur de lecture.
   * Par défaut "standard" qui correspond à une lecture à 60rem
   **/
  contentSize?: LayoutContentSize;
  children: ViewAllowedChild | ViewAllowedChild[];
} & HTMLAttributes<HTMLDivElement>) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const handleScroll = () => {
      setHasScrolled(el.scrollTop > 0);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const childrenList = isArray(children) ? children : [children];
  const header = childrenList.find((it) => it.type === ViewHeader || it.type === ViewTitle);
  const body = childrenList.find((it) => it.type === ViewBody);
  const footer = childrenList.find((it) => it.type === ViewFooter);
  const styles = useStyles();

  const sizingStyles =
    contentSize === "large"
      ? styles.contentLarge
      : contentSize === "small"
        ? styles.contentSmall
        : contentSize === "xsmall"
          ? styles.contentXSmall
          : styles.contentStandard;

  const bodyStyles = mergeClasses(styles.body, sizingStyles);
  const headerWrapperStyles = mergeClasses(styles.headerWrapper, hasScrolled ? styles.headerWithShadow : undefined);
  const headerStyles = mergeClasses(styles.header, sizingStyles);
  const footerStyles = mergeClasses(styles.footer, sizingStyles);

  return (
    <div {...otherProps} className={styles.root}>
      <div className={styles.content}>
        <div className={headerWrapperStyles}>
          <div className={headerStyles}>{header}</div>
        </div>
        <div className={styles.bodyWrapper} ref={bodyRef}>
          <div className={bodyStyles}>{body}</div>
        </div>
        <div className={styles.footerWrapper}>
          <div className={footerStyles}>{footer}</div>
        </div>
      </div>
    </div>
  );
}
