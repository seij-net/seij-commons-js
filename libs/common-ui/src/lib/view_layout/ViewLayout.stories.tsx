import { Meta, StoryObj } from "@storybook/react-vite";
import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { ViewLayout } from "./ViewLayout";
import { ApplicationShell } from "../applicationshell/ApplicationShell";
import { ViewTitle } from "./ViewTitle";
import { ViewBody } from "./ViewBody";
import { ViewFooter } from "./ViewFooter";
import { PropsWithChildren } from "react";

const meta = {
  title: "Shell/ViewLayout",
  component: ViewLayout,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof ViewLayout>;
export default meta;

type Story = StoryObj<typeof ViewLayout>;

export const Example: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <SampleShell>
        <ViewLayout>
          <ViewTitle>My application title</ViewTitle>
          <ViewBody>
            <LoremIpsum paragraphs={100} />
          </ViewBody>
          <ViewFooter>
            <div style={{ backgroundColor: "lightblue" }}>My application Footer</div>
          </ViewFooter>
        </ViewLayout>
      </SampleShell>
    );
  },
};
export const ExampleWithTitleBarActions: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <SampleShell>
        <ViewLayout>
          <ViewTitle
            onBack={() => {}}
            actions={[
              {
                id: "primary",
                label: "Create",
                onClick: () => {},
                type: "PRIMARY",
                icon: "plus",
              },
              {
                id: "secondary",
                label: "Other",
                onClick: () => {},
                type: "SECONDARY",
                icon: "trash",
              },
              {
                id: "a1",
                label: "Additional 1",
                onClick: () => {},
                type: "ADDITIONAL",
                icon: "trash",
              },
              {
                id: "a2",
                label: "Additional 2",
                onClick: () => {},
                type: "ADDITIONAL",
                icon: "trash",
              },
              {
                id: "a3",
                label: "Additional 3 disabled",
                onClick: () => {},
                disabled: true,
                type: "ADDITIONAL",
                icon: "trash",
              },
              {
                id: "a4",
                label: "Additional 4",
                onClick: () => {},
                type: "ADDITIONAL",
                icon: "trash",
              },
            ]}
          >
            My application title
          </ViewTitle>
          <ViewBody>
            <LoremIpsum paragraphs={100} />
          </ViewBody>
          <ViewFooter>
            <div style={{ backgroundColor: "lightblue" }}>My application Footer</div>
          </ViewFooter>
        </ViewLayout>
      </SampleShell>
    );
  },
};
const SampleShell = ({ children }: PropsWithChildren) => {
  return (
    <ApplicationShell
      applicationName="mon appli"
      navigationItems={[]}
      onClickHome={() => {}}
      matchPath={() => false}
      navigate={() => {}}
      userStatus={{
        isLoading: false,
        isAuthenticated: true,
        errorMessage: null,
        userName: "toto",
        onClickSignIn: () => {},
        onClickSignOut: () => null,
      }}
      main={children}
    />
  );
};

type LoremIpsumProps = {
  paragraphs?: number;
};

export const LoremIpsum: React.FC<LoremIpsumProps> = ({ paragraphs = 1 }) => {
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet cursus, enim erat dictum urna, at cursus enim erat euismod urna. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  return (
    <>
      {Array.from({ length: paragraphs }).map((_, idx) => (
        <p key={idx}>{text}</p>
      ))}
    </>
  );
};
