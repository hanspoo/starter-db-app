import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ActivationComplete } from './activation-complete';

export default {
  component: ActivationComplete,
  title: 'ActivationComplete',
} as ComponentMeta<typeof ActivationComplete>;

const Template: ComponentStory<typeof ActivationComplete> = (args) => (
  <ActivationComplete {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};

