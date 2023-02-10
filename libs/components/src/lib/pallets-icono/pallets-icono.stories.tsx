import { ComponentStory, ComponentMeta } from '@storybook/react';
import { palletsData } from '../pallets-data';
import { PalletsIcono } from './pallets-icono';

export default {
  component: PalletsIcono,
  title: 'PalletsIcono',
} as ComponentMeta<typeof PalletsIcono>;

const Template: ComponentStory<typeof PalletsIcono> = (args) => (
  <PalletsIcono {...args} />
);

export const Primary = Template.bind({});
Primary.args = { pallets: palletsData };
