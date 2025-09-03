import React from 'react';
import View from '../components/blocks/BlocoSustentabilidade/View';

// Storybook configuration para um único cenário "Playground"
export default {
  title: 'Blocks/BlocoSustentabilidade',
  component: View,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    num_equipamentos: {
      control: 'text',
      name: 'Equipamentos eletroeletrônicos recolhidos',
    },
    num_recondicionados: {
      control: 'text',
      name: 'Equipamentos recondicionados e doados',
    },
    num_toneladas: {
      control: 'text',
      name: 'Toneladas de material descaracterizado de maneira segura',
    },
    num_entidades: {
      control: 'text',
      name: 'Entidades sociais e instituições beneficiadas',
    },
  },
};

const Template = (args) => React.createElement(View, { data: args });

export const Playground = Template.bind({});
Playground.args = {
  num_equipamentos: '+12000',
  num_recondicionados: '+1500',
  num_toneladas: '+1000',
  num_entidades: '+200',
};
