import { SeijUIProviderDecorator } from "../../stories/utils/SeijUIProviderDecorator";
import { FormField, FormLayout, FormLayoutType, FormSectionTitle, FormText } from "./FormLayout";
import { Meta, StoryObj } from "@storybook/react-vite";
import { InputText } from "../text/InputText";
import { SwitchButton } from "../switchbutton/SwitchButton";
const meta = {
  title: "Composites/FormLayout",
  component: FormLayout,
  decorators: [SeijUIProviderDecorator],
} satisfies Meta<typeof FormLayout>;
export default meta;
type Story = StoryObj<typeof FormLayout>;

export const Fluid: Story = {
  render: (args) => <Form variant={"fluid"} />,
};
export const Table: Story = {
  render: (args) => <Form variant={"table"} />,
};

const Form = ({ variant }: { variant: FormLayoutType }) => {
  return (
    <FormLayout variant={variant}>
      <FormSectionTitle>Section title</FormSectionTitle>
      <FormField label="Field with inline hint" hint="Hint" hintPosition="inline">
        <InputText value={"toto"} onValueChange={() => {}} />
      </FormField>
      <FormField label="Field with infobutton hint" hint="Hint" hintPosition="infobutton">
        <InputText value={"toto"} onValueChange={() => {}} />
      </FormField>
      <FormField label="Field with default hint position" hint="Hint">
        <InputText value={"toto"} onValueChange={() => {}} />
      </FormField>
      <FormField label="Field with no hint">
        <InputText value={"toto"} onValueChange={() => {}} />
      </FormField>
      <FormSectionTitle>No inputs, just text</FormSectionTitle>
      <FormField label="Field with inline hint" hint="Hint" hintPosition="inline">
        <FormText>toto</FormText>
      </FormField>
      <FormField label="Field with infobutton hint" hint="Hint" hintPosition="infobutton">
        <FormText>toto</FormText>
      </FormField>
      <FormField label="Field with default hint position" hint="Hint">
        <FormText>toto</FormText>
      </FormField>
      <FormField label="Field with no hint">
        <FormText>toto</FormText>
      </FormField>
      <FormSectionTitle>Switch button specials</FormSectionTitle>
      <FormField label="Field with inline hint" hint="Hint" hintPosition="inline">
        <SwitchButton value={true} labelTrue="this is true" onValueChange={() => {}} />
      </FormField>
      <FormField label="Field with infobutton hint" hint="Hint" hintPosition="infobutton">
        <SwitchButton value={true} labelTrue="this is true" onValueChange={() => {}} />
      </FormField>
      <FormField label="Field with default hint position" hint="Hint">
        <SwitchButton value={true} labelTrue="this is true" onValueChange={() => {}} />
      </FormField>
      <FormField label="Field with no hint">
        <SwitchButton value={true} labelTrue="this is true" onValueChange={() => {}} />
      </FormField>
    </FormLayout>
  );
};
