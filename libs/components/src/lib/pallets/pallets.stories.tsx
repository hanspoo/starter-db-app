import { ComponentStory, ComponentMeta } from '@storybook/react';
import { palletsData } from '../pallets-data';
import { Pallets } from './pallets';

export default {
  component: Pallets,
  title: 'Pallets',
} as ComponentMeta<typeof Pallets>;

const Template: ComponentStory<typeof Pallets> = (args) => (
  <Pallets {...args} />
);

export const Primary = Template.bind({});
Primary.args = { pallets: palletsData };
