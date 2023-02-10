import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SignupForm } from './signup-form';

export default {
  component: SignupForm,
  title: 'SignupForm',
} as ComponentMeta<typeof SignupForm>;

const Template: ComponentStory<typeof SignupForm> = (args) => (
  <SignupForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
