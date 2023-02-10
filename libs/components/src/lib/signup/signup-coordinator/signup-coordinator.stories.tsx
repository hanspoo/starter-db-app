import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SignupCoordinator } from "./signup-coordinator";

export default {
  component: SignupCoordinator,
  title: "SignupCoordinator",
} as ComponentMeta<typeof SignupCoordinator>;

const Template: ComponentStory<typeof SignupCoordinator> = (args) => (
  <SignupCoordinator {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
