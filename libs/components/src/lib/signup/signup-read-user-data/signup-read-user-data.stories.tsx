import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SignupReadUserData } from "./signup-read-user-data";

export default {
  component: SignupReadUserData,
  title: "SignupReadUserData",
} as ComponentMeta<typeof SignupReadUserData>;

const Template: ComponentStory<typeof SignupReadUserData> = (args) => (
  <SignupReadUserData {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
