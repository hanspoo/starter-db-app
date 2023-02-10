import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SignupReadCompanyData } from "./signup-read-company-data";

export default {
  component: SignupReadCompanyData,
  title: "SignupReadCompanyData",
} as ComponentMeta<typeof SignupReadCompanyData>;

const Template: ComponentStory<typeof SignupReadCompanyData> = (args) => (
  <SignupReadCompanyData {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
