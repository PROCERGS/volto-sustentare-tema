import React from 'react';
import View from '../components/blocks/imagemTextoAba/View';

// Storybook configuration para um único cenário "Playground"
export default {
  title: 'Blocks/ImagemTextoAba',
  component: View,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    // Campos do schema com rótulos em PT-BR
    image_position: {
      name: 'Posição da imagem',
      control: { type: 'inline-radio' },
      options: ['left', 'right'],
      labels: { left: 'Esquerda', right: 'Direita' },
    },
    title: { control: 'text', name: 'Título' },
    text: { control: 'text', name: 'Texto' },
    highlight_text: { control: 'text', name: 'Texto em destaque' },
    show_button: { control: 'boolean', name: 'Exibir botão' },
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
  image_position: 'left',
  title: 'Título do bloco Imagem + Texto + Aba',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, nisl at consequat ultricies, lorem nulla posuere arcu.',
  highlight_text: 'Texto em destaque que aparece logo após o texto principal.',
  show_button: true,
  button_text: 'Saiba Mais',
  button_url: '/exemplo-de-link',
};
