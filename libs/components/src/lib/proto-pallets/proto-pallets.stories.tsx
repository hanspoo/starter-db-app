import { IProtoPallet } from '@flash-ws/api-interfaces';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProtoPallets } from './proto-pallets';

export default {
  component: ProtoPallets,
  title: 'ProtoPallets',
} as ComponentMeta<typeof ProtoPallets>;

const protos: Array<IProtoPallet> = [{ "id": 1, "nombre": "Standard Pallet", "box": { "id": 1, "largo": 100.00, "ancho": 120.00, "alto": 170.00 } }];
const Template: ComponentStory<typeof ProtoPallets> = (args) => (
  <ProtoPallets {...args} protos={protos} />
);

export const Primary = Template.bind({});
Primary.args = { protos };
