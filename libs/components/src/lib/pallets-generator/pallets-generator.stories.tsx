import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PalletsGenerator } from './pallets-generator';

export default {
  component: PalletsGenerator,
  title: 'PalletsGenerator',
} as ComponentMeta<typeof PalletsGenerator>;

const Template: ComponentStory<typeof PalletsGenerator> = (args) => (
  <PalletsGenerator {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
