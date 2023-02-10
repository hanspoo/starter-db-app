import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GraficoAvance } from './grafico-avance';

export default {
  component: GraficoAvance,
  title: 'GraficoAvance',
} as ComponentMeta<typeof GraficoAvance>;

const Template: ComponentStory<typeof GraficoAvance> = (args) => (
  <GraficoAvance {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
