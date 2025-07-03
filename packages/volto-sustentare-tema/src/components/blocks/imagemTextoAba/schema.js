export default function imagemTextoAbaSchema({ formData } = {}) {
  const showButtonFields = formData?.show_button;

  return {
    title: 'Imagem Texto Aba',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'image_position',
          'title',
          'text',
          'highlight_text',
          'show_button',
          ...(showButtonFields ? ['button_text', 'button_url'] : []),
        ],
      },
    ],
    properties: {
      image_position: {
        title: 'Posição da imagem',
        type: 'string',
        choices: [
          ['left', 'Esquerda'],
          ['right', 'Direita'],
        ],
        default: 'left',
      },
      title: {
        title: 'Título',
        type: 'string',
      },
      text: {
        title: 'Texto',
        type: 'string',
        widget: 'textarea',
      },
      highlight_text: {
        title: 'Texto em destaque',
        type: 'string',
        widget: 'text',
        description:
          'Texto que será exibido em destaque logo após o texto principal.',
      },
      show_button: {
        title: 'Exibir botão',
        type: 'boolean',
      },
      button_text: {
        title: 'Texto do botão',
        type: 'string',
        widget: 'text',
      },
      button_url: {
        title: 'URL de redirecionamento',
        type: 'string',
        widget: 'text',
        description: 'Exemplo: /pagina-ou-link-completo',
      },
    },
    required: ['image'],
    dependencies: {
      show_button: {
        oneOf: [
          {
            properties: {
              show_button: { const: true },
              button_text: { type: 'string' },
              button_url: { type: 'string' },
            },
            required: ['button_text', 'button_url'],
          },
          {
            properties: {
              show_button: { const: false },
            },
          },
        ],
      },
    },
  };
}
