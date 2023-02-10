import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PalletBarcode } from './pallet-barcode';

export default {
  component: PalletBarcode,
  title: 'PalletBarcode',
} as ComponentMeta<typeof PalletBarcode>;

const Template: ComponentStory<typeof PalletBarcode> = (args) => (
  <PalletBarcode {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
