import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ListaCajasPallet } from './lista-cajas-pallet';
import { cajas } from './cajas';
export default {
  component: ListaCajasPallet,
  title: 'ListaCajasPallet',
} as ComponentMeta<typeof ListaCajasPallet>;

const Template: ComponentStory<typeof ListaCajasPallet> = (args) => (
  <ListaCajasPallet {...args} />
);

export const Primary = Template.bind({});
Primary.args = { cajas };
