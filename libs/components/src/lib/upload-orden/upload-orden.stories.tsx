import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UploadOrden } from './upload-orden';

export default {
  component: UploadOrden,
  title: 'UploadOrden',
} as ComponentMeta<typeof UploadOrden>;

const Template: ComponentStory<typeof UploadOrden> = (args) => <UploadOrden />;

export const Primary = Template.bind({});
Primary.args = {};
