export default function schemaEnhancer({ schema }) {
  schema.title = 'Grid de Notícias (Scroll Horizontal)';
  schema.fieldsets[0].fields = [
    'title',
    'query',
    ...schema.fieldsets[0].fields.filter((f) => f !== 'title' && f !== 'query'),
  ];
  schema.properties.title = {
    title: 'Título do bloco',
    type: 'string',
  };
  schema.properties.query = {
    title: 'Critérios de busca',
    widget: 'querystring',
    description: 'Configure o filtro para buscar apenas notícias.',
  };
  return schema;
}
