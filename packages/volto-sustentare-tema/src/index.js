import VideoDestaqueView from './components/blocks/VideoDestaque/View';
import VideoDestaqueEdit from './components/blocks/VideoDestaque/Edit';
import VideoDestaqueSchema from './components/blocks/VideoDestaque/schema';

import ImagemTextoAbaView from './components/blocks/imagemTextoAba/View';
import ImagemTextoAbaEdit from './components/blocks/imagemTextoAba/Edit';
import ImagemTextoAbaSchema from './components/blocks/imagemTextoAba/schema';

import CardsView from './components/blocks/Cards/View';
import CardsEdit from './components/blocks/Cards/Edit';
import CardsSchema from './components/blocks/Cards/schema';

import ScrollHorizontal from './components/blocks/listing/ScrollHorizontal/ScrollHorizontal';

import videoSVG from '@plone/volto/icons/video.svg';
import imageSVG from '@plone/volto/icons/image.svg';

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

  config.blocks.blocksConfig.listing.variations = [
    ...(config.blocks.blocksConfig.listing.variations || []),
    {
      id: 'scroll-horizontal',
      title: 'Grid Scroll Horizontal',
      template: ScrollHorizontal,
    },
  ];

  return config;
};

export default applyConfig;
