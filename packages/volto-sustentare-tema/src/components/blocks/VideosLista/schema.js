export default function VideosListaSchema({ formData } = {}) {
  return {
    title: 'Lista de Vídeos',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'videos'],
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
    },
    required: [],
  };
}
