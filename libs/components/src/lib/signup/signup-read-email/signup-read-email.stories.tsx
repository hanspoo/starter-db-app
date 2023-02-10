import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SignupReadEmail } from "./signup-read-email";


export default {
  component: SignupReadEmail,
  title: "SignupReadEmail",
} as ComponentMeta<typeof SignupReadEmail>;

const Template: ComponentStory<typeof SignupReadEmail> = (args) => (
  <SignupReadEmail {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
