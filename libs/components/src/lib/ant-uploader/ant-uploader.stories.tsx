import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AntUploader } from './ant-uploader';

export default {
  component: AntUploader,
  title: 'AntUploader',
} as ComponentMeta<typeof AntUploader>;

const Template: ComponentStory<typeof AntUploader> = (args) => (
  <AntUploader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
