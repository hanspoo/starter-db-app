import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LoginForm } from './login-form';

export default {
  component: LoginForm,
  title: 'LoginForm',
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = (args) => (
  <LoginForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
