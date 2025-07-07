export default function BlocoSustentabilidadeSchema({ formData } = {}) {
  return {
    title: 'Bloco Sustentabilidade',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'num_equipamentos',
          'num_recondicionados',
          'num_toneladas',
          'num_entidades',
        ],
      },
    ],
    properties: {
      num_equipamentos: {
        title: 'Equipamentos eletroeletrônicos recolhidos',
        type: 'string',
        default: '+12000',
      },
      num_recondicionados: {
        title: 'Equipamentos recondicionados e doados',
        type: 'string',
        default: '+1500',
      },
      num_toneladas: {
        title: 'Toneladas de material descaracterizado de maneira segura',
        type: 'string',
        default: '+1000',
      },
      num_entidades: {
        title: 'Entidades sociais e instituições beneficiadas',
        type: 'string',
        default: '+200',
      },
    },
    required: [],
  };
}
