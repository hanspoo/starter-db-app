import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SignupReadSecCode } from "./signup-read-sec-code";

export default {
  component: SignupReadSecCode,
  title: "SignupReadSecCode",
} as ComponentMeta<typeof SignupReadSecCode>;

const Template: ComponentStory<typeof SignupReadSecCode> = (args) => (
  <SignupReadSecCode {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
