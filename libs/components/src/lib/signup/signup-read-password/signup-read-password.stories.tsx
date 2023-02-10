import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SignupReadPassword } from "./signup-read-password";

export default {
  component: SignupReadPassword,
  title: "SignupReadPassword",
} as ComponentMeta<typeof SignupReadPassword>;

const Template: ComponentStory<typeof SignupReadPassword> = (args) => (
  <SignupReadPassword {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
