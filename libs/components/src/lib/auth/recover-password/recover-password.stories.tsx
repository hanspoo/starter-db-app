import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RecoverPassword } from './recover-password';

export default {
  component: RecoverPassword,
  title: 'RecoverPassword',
} as ComponentMeta<typeof RecoverPassword>;

const Template: ComponentStory<typeof RecoverPassword> = (args) => (
  <RecoverPassword {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
