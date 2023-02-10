import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Registration } from './registration';

export default {
  component: Registration,
  title: 'Registration',
} as ComponentMeta<typeof Registration>;

const Template: ComponentStory<typeof Registration> = (args) => (
  <Registration {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
