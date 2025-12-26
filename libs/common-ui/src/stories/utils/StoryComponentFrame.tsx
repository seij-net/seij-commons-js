import { PropsWithChildren } from "react";
/**
 * StoryComponentFrame visually highlights the boundaries and spacing of a wrapped component.
 * It renders a yellow background with padding, and places the child component inside a white box with a dashed border.
 *
 * Use this frame in Storybook to clearly see the actual margins, padding, and positioning of your component within its container.
 */
export const StoryComponentFrame = ({ title, children }: PropsWithChildren & { title: string }) => {
  return (
    <div>
      <div>{title}</div>
      <div style={{ backgroundColor: "lightyellow", padding: "1em" }}>
        <div style={{ backgroundColor: "white", border: "1px dashed #ccc" }}>{children}</div>
      </div>
    </div>
  );
};
