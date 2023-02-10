import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileUpload } from './file-upload';

export default {
  component: FileUpload,
  title: 'FileUpload',
} as ComponentMeta<typeof FileUpload>;

const Template: ComponentStory<typeof FileUpload> = (args) => (
  <FileUpload {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
