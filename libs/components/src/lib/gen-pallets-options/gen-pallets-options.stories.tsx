import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GenPalletsOptions } from './gen-pallets-options';

export default {
  component: GenPalletsOptions,
  title: 'GenPalletsOptions',
} as ComponentMeta<typeof GenPalletsOptions>;

const Template: ComponentStory<typeof GenPalletsOptions> = (args) => (
  <GenPalletsOptions {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
