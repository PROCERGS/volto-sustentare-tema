export default function CardsSchema({ formData } = {}) {
  return {
    title: 'Cards',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['cards'],
      },
    ],
    properties: {
      cards: {
        title: 'Cards',
        widget: 'object_list',
        schema: {
          title: 'Card',
          fieldsets: [
            {
              id: 'default',
              title: 'Card',
              fields: [
                'title',
                'image',
                'image_hover',
                'text',
                'button_text',
                'button_url',
              ],
            },
          ],
          properties: {
            image: {
              title: 'Imagem',
              widget: 'image',
            },
            image_hover: {
              title: 'Imagem (hover)',
              widget: 'image',
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
            button_text: {
              title: 'Texto do botão',
              type: 'string',
            },
            button_url: {
              title: 'URL do botão',
              type: 'string',
              widget: 'text',
              description: 'Informe um caminho relativo, ex.: /pagina',
            },
          },
          required: [],
        },
      },
    },
    required: [],
  };
}
