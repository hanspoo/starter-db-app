import { IPalletConsolidado } from '@flash-ws/api-interfaces';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DetallePallet } from './detalle-pallet';

export default {
  component: DetallePallet,
  title: 'DetallePallet',
} as ComponentMeta<typeof DetallePallet>;

const Template: ComponentStory<typeof DetallePallet> = (args) => (
  <DetallePallet {...args} />
);

const pallet: IPalletConsolidado = {
  numcajas: 8,
  vol: 101707,
  peso: 11386,
  palletid: 1483,
  nombrelocal: '835 - SISA CHIGUAYANTE',
  porcUso: 4.9856372549019605,
};

export const Primary = Template.bind({});
Primary.args = { pallet };
