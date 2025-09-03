import React from 'react';
import View from '../components/blocks/VideoDestaque/View';

// Storybook configuration para um único cenário "Playground"
export default {
  title: 'Blocks/VideoDestaque',
  component: View,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    // Campos do schema com rótulos em PT-BR
    video_url: { control: 'text', name: 'URL do vídeo' },
    title: { control: 'text', name: 'Título' },
  text: { control: 'text', name: 'Texto (pode ser multilinha)' },
    video_position: {
      name: 'Posição do vídeo',
      control: { type: 'inline-radio' },
      options: ['left', 'right'],
      labels: { left: 'Esquerda', right: 'Direita' },
    },
    border_color: { control: 'color', name: 'Cor da borda do vídeo' },
    show_button: { control: 'boolean', name: 'Exibir botão de redirecionamento' },
    button_text: {
      control: 'text',
      name: 'Texto do botão',
      if: { arg: 'show_button' },
    },
    button_url: {
      control: 'text',
      name: 'URL de redirecionamento',
      if: { arg: 'show_button' },
    },
  },
};

const Template = (args) => React.createElement(View, { data: args });

export const Playground = Template.bind({});
Playground.args = {
  video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Responsabilidade pública, sustentabilidade e inclusão',
  text:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, nisl at consequat ultricies, lorem nulla posuere arcu, a luctus nisi tortor a arcu.',
  video_position: 'right',
  border_color: '#000000',
  show_button: true,
  button_text: 'Saiba Mais',
  button_url: 'https://www.youtube.com/',
};
