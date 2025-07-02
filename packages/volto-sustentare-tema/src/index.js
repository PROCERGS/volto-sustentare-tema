import VideoDestaqueView from './components/blocks/VideoDestaque/View';
import VideoDestaqueEdit from './components/blocks/VideoDestaque/Edit';
import VideoDestaqueSchema from './components/blocks/VideoDestaque/schema';

import videoSVG from '@plone/volto/icons/video.svg';

const applyConfig = (config) => {
  config.blocks.blocksConfig.videodestaque = {
    id: 'videodestaque',
    title: 'Vídeo Destaque',
    icon: videoSVG,
    group: 'procergs',
    view: VideoDestaqueView,
    edit: VideoDestaqueEdit,
    schema: VideoDestaqueSchema,
    sidebarTab: 1,
  };
  return config;
};

export default applyConfig;
