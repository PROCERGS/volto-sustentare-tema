import VideoDestaqueView from './components/blocks/VideoDestaque/View';
import VideoDestaqueEdit from './components/blocks/VideoDestaque/Edit';
import VideoDestaqueSchema from './components/blocks/VideoDestaque/schema';

import ImagemTextoAbaView from './components/blocks/imagemTextoAba/View';
import ImagemTextoAbaEdit from './components/blocks/imagemTextoAba/Edit';
import ImagemTextoAbaSchema from './components/blocks/imagemTextoAba/schema';

import CardsView from './components/blocks/Cards/View';
import CardsEdit from './components/blocks/Cards/Edit';
import CardsSchema from './components/blocks/Cards/schema';

import BlocoSustentabilidadeView from './components/blocks/BlocoSustentabilidade/View';
import BlocoSustentabilidadeEdit from './components/blocks/BlocoSustentabilidade/Edit';
import BlocoSustentabilidadeSchema from './components/blocks/BlocoSustentabilidade/schema';

import BlocoListaVideosView from './components/blocks/VideosLista/View';
import BlocoListaVideosEdit from './components/blocks/VideosLista/Edit';
import BlocoListaVideosSchema from './components/blocks/VideosLista/schema';

import BlocoFuncionamentoView from './components/blocks/blocoFuncionamento/View';

import ScrollHorizontal from './components/blocks/listing/ScrollHorizontal/ScrollHorizontal';

import videoSVG from '@plone/volto/icons/video.svg';
import imageSVG from '@plone/volto/icons/image.svg';
import FaviconHelmet from './components/AppExtras/FaviconHelmet';

const applyConfig = (config) => {
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'sustentare', title: 'Sustentare' },
  ];

  config.blocks.blocksConfig.videodestaque = {
    id: 'videodestaque',
    title: 'Vídeo Destaque',
    icon: videoSVG,
    group: 'sustentare',
    view: VideoDestaqueView,
    edit: VideoDestaqueEdit,
    schema: VideoDestaqueSchema,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.imagemTextoAba = {
    id: 'imagemTextoAba',
    title: 'Aba',
    icon: imageSVG,
    group: 'sustentare',
    view: ImagemTextoAbaView,
    edit: ImagemTextoAbaEdit,
    schema: ImagemTextoAbaSchema,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.cards = {
    id: 'cards',
    title: 'Cards',
    icon: imageSVG,
    group: 'sustentare',
    view: CardsView,
    edit: CardsEdit,
    schema: CardsSchema,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.blocoSustentabilidade = {
    id: 'blocoSustentabilidade',
    title: 'Bloco Sustentabilidade',
    icon: imageSVG,
    group: 'sustentare',
    view: BlocoSustentabilidadeView,
    edit: BlocoSustentabilidadeEdit,
    schema: BlocoSustentabilidadeSchema,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.blocoListaVideos = {
    id: 'blocoListaVideos',
    title: 'Lista de Vídeos',
    icon: videoSVG,
    group: 'sustentare',
    view: BlocoListaVideosView,
    edit: BlocoListaVideosEdit,
    schema: BlocoListaVideosSchema,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.blocoFuncionamento = {
    id: 'blocoFuncionamento',
    title: 'Como Funciona',
    icon: imageSVG,
    group: 'sustentare',
    view: BlocoFuncionamentoView,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.listing.variations = [
    ...(config.blocks.blocksConfig.listing.variations || []),
    {
      id: 'scroll-horizontal',
      title: 'Grid Scroll Horizontal',
      template: ScrollHorizontal,
    },
  ];

  // Inject our favicon AppExtra so it overrides the default favicon using Helmet
  // Register as an object with component for compatibility across Volto versions
  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    { match: '', component: FaviconHelmet },
  ];

  return config;
};

export default applyConfig;
