import { defineMessages } from 'react-intl';

const messages = defineMessages({
  blocoEspacador: {
    id: 'bloco-espacador',
    defaultMessage: 'Espaçador',
  },
  height: {
    id: 'height',
    defaultMessage: 'Altura',
  },
  default: {
    id: 'default',
    defaultMessage: 'Padrão',
  },
});

export const BlocoEspacadorSchema = (props) => {
  return {
    title: props.intl.formatMessage(messages.blocoEspacador),
    fieldsets: [
      {
        id: 'default',
        title: props.intl.formatMessage(messages.default),
        fields: ['height'],
      },
    ],
    properties: {
      height: {
        title: props.intl.formatMessage(messages.height),
        type: 'number', 
        description: 'Altura em pixels (px)',
        default: 30,
      },
    },
    required: [],
  };
};