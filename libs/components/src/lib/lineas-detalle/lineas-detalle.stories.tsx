import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LineasDetalle } from './lineas-detalle';

import { lineas } from './lineas-para-react';

export default {
  component: LineasDetalle,
  title: 'LineasDetalle',
} as ComponentMeta<typeof LineasDetalle>;

const Template: ComponentStory<typeof LineasDetalle> = (args) => (
  <LineasDetalle {...args} />
);

export const SinDatos = Template.bind({});
SinDatos.args = {};

export const ConDatosSinLineas = Template.bind({});
ConDatosSinLineas.args = { lineas: [] };

export const ConLineas = Template.bind({});
ConLineas.args = { lineas };
