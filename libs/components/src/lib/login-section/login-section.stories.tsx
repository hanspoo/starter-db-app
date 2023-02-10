import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LoginSection } from './login-section';

export default {
  component: LoginSection,
  title: 'LoginSection',
} as ComponentMeta<typeof LoginSection>;

const Template: ComponentStory<typeof LoginSection> = (args) => (
  <LoginSection {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
