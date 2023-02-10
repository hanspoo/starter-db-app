import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Preferencias } from './preferencias';

export default {
  component: Preferencias,
  title: 'Preferencias',
} as ComponentMeta<typeof Preferencias>;

const Template: ComponentStory<typeof Preferencias> = (args) => (
  <Preferencias {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
