import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ActivationForm } from './activation-form';

export default {
  component: ActivationForm,
  title: 'ActivationForm',
  argTypes: {
    cancel: { action: 'cancel executed!' },
  },
} as ComponentMeta<typeof ActivationForm>;

const Template: ComponentStory<typeof ActivationForm> = (args) => (
  <ActivationForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = { email: "newuser@myapp.com" };
