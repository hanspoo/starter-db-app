import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SelectorEstado } from './selector-estado';

export default {
  component: SelectorEstado,
  title: 'SelectorEstado',
} as ComponentMeta<typeof SelectorEstado>;

const Template: ComponentStory<typeof SelectorEstado> = (args) => (
  <SelectorEstado {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
