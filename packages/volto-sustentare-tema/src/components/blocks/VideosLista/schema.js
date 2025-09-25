export default function VideosListaSchema({ formData } = {}) {
  const showButtonFields = formData?.show_button;

  return {
    title: 'Lista de Vídeos',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'videos','show_button',
          ...(showButtonFields ? ['button_url'] : []),],
      },
    ],
    properties: {
      title: {
        title: 'Título do bloco',
        type: 'string',
      },
      videos: {
        title: 'Vídeos',
        widget: 'object_list',
        schema: {
          title: 'Vídeo',
          fieldsets: [
            {
              id: 'default',
              title: 'Vídeo',
              fields: ['url', 'title'],
            },
          ],
          properties: {
            url: {
              title: 'URL do vídeo',
              type: 'string',
              description: 'Cole aqui a URL do vídeo (YouTube, Vimeo, etc)',
            },
            title: {
              title: 'Título',
              type: 'string',
            },
          },
          required: ['url'],
        },
      },
      show_button: {
        title: 'Exibir botão de redirecionamento',
        type: 'boolean',
      },
      button_url: {
        title: 'URL de redirecionamento',
        type: 'string',
        widget: 'text',
        description: 'Exemplo: /pagina-ou-link-completo',
      },
    },
    required: [],
  };
}
