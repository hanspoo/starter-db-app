import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ArchivoComponent } from './archivo-component';

export default {
  component: ArchivoComponent,
  title: 'ArchivoComponent',
} as ComponentMeta<typeof ArchivoComponent>;

const Template: ComponentStory<typeof ArchivoComponent> = (args) => (
  <ArchivoComponent {...args} />
);

const archivo = {
  id: 7,
  originalname: 'el dolar observado.pdf',
  mimetype: 'application/pdf',
  destination: '/home/julian/embarcadero/uploads',
  filename: 'a994fc2c38651e77bbc5a70a3eeb6504',
  path: '/home/julian/embarcadero/uploads/a994fc2c38651e77bbc5a70a3eeb6504',
  size: 33130,
};

export const Primary = Template.bind({});
Primary.args = { archivo };
