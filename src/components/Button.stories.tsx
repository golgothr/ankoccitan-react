import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Bouton Principal',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Bouton Secondaire',
    variant: 'secondary',
  },
}

export const Danger: Story = {
  args: {
    children: 'Bouton Danger',
    variant: 'danger',
  },
}

export const Small: Story = {
  args: {
    children: 'Petit Bouton',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Grand Bouton',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Bouton Désactivé',
    disabled: true,
  },
}

export const WithClick: Story = {
  args: {
    children: 'Cliquez-moi',
    onClick: () => alert('Bouton cliqué !'),
  },
} 