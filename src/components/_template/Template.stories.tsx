import type { Meta, StoryObj } from '@storybook/react';
import { Template } from './Template';

const meta = {
  title: 'Components/_Template',
  component: Template,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reference implementation. Copy this folder when adding a new component — it embodies every Engineering Guideline (exported props, ref as prop, public sd-* block class, BEM modifiers via CSS Modules, semantic tokens only, full unit + a11y tests).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'subtle'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default template',
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    children: 'Subtle variant',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled template',
  },
};

export const LongContent: Story = {
  args: {
    children:
      'A long block of content that exercises wrapping behavior, padding, and line-height to make sure the template renders sensibly across content lengths and viewport widths.',
  },
};
