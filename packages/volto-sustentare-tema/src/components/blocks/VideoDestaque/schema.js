export default function VideoDestaqueSchema({ formData } = {}) {
  const showButtonFields = formData?.show_button;

  return {
    title: 'Vídeo Destaque',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'video_url',
          'title',
          'text',
          'video_position',
          'border_color',
          'show_button',
          ...(showButtonFields ? ['button_text', 'button_url'] : []),
        ],
      },
    ],
    properties: {
      video_url: {
        title: 'URL do vídeo',
        type: 'string',
        description: 'Cole aqui a URL do vídeo (YouTube, Vimeo, etc)',
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
      video_position: {
        title: 'Posição do vídeo',
        type: 'string',
        choices: [
          ['left', 'Esquerda'],
          ['right', 'Direita'],
        ],
        default: 'left',
      },
      border_color: {
        title: 'Cor da borda do vídeo',
        type: 'string',
        description: 'Cor hexadecimal (ex: #00b033)',
      },
      show_button: {
        title: 'Exibir botão de redirecionamento',
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
    required: ['video_url'],
    dependencies: {
      show_button: {
        oneOf: [
          {
            properties: {
              show_button: {
                const: true,
              },
              button_text: { type: 'string' },
              button_url: { type: 'string' },
            },
            required: ['button_text', 'button_url'],
          },
          {
            properties: {
              show_button: {
                const: false,
              },
            },
          },
        ],
      },
    },
  };
}
