import React, { useEffect } from 'react';
import { Helmet } from '@plone/volto/helpers';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_3133_16115)">
    <path d="M1.54664 38L0.43064 32.4134H7.12947C7.68818 32.4134 7.85987 32.2477 7.85987 31.7927V26.3312C7.85987 25.504 7.55871 25.4618 6.70024 25.4618H3.47889C1.63249 25.4618 0 25.0475 0 22.0689V11.8901C0 9.53224 1.2877 8 4.20929 8H12.7982L13.8719 13.5866H6.82831C6.31323 13.5866 6.05569 13.793 6.05569 14.248V19.7095C6.05569 20.3303 6.35686 20.496 7 20.496H10.9081C12.884 20.496 14 21.3231 14 23.5575V33.447C14 36.757 12.7982 37.9985 9.23341 37.9985H1.54664V38Z" fill="#00B033"/>
    <path d="M22.9387 15.9546L26.1341 10.4942C26.1341 10.4942 27.2464 8.89651 29.2486 9.34143C31.2507 9.78635 31.4732 10.7975 32.8282 12.9817L29.0463 19.4938L22.9387 15.9546Z" fill="#00B033"/>
    <path d="M44.6393 18.0334L47.8007 23.5141C47.8007 23.5141 48.638 25.272 47.2595 26.7904C45.8811 28.3096 44.8925 28.0022 42.3241 28.0976L38.5398 21.5872L44.6393 18.0343V18.0334Z" fill="#00B033"/>
    <path d="M32.1202 35.8146L25.7934 35.8097C25.7934 35.8097 23.8527 35.6552 23.2274 33.7016C22.602 31.7479 23.3625 31.0466 24.5654 28.7742L32.0959 28.7556L32.1202 35.8146Z" fill="#00B033"/>
    <path d="M30.5298 9.00081H38.646C38.646 9.00081 39.2932 8.97816 39.6507 9.47647C40.0083 9.9756 41.8689 13.1637 41.8689 13.1637L43.9455 11.9033L40.5746 17.9972L33.6443 17.8823L35.7742 16.6422L32.269 10.575C32.269 10.575 31.4941 9.32682 30.5298 9V9.00081Z" fill="#00B033"/>
    <path d="M22.1948 32.7022L18.1792 25.6489C18.1792 25.6489 17.8386 25.098 18.0959 24.5407C18.3531 23.9833 20.2032 20.7887 20.2032 20.7887L18.0805 19.6085L25.044 19.5227L28.3728 25.602L26.2412 24.3643L22.7029 30.4128C22.7029 30.4128 22.0015 31.7039 22.1948 32.7038V32.7022Z" fill="#00B033"/>
    <path d="M46.8412 28.0806L42.8077 35.1241C42.8077 35.1241 42.506 35.6969 41.896 35.7592C41.2861 35.8215 37.594 35.8514 37.594 35.8514L37.6563 38.2799L34.0427 32.3268L37.5859 26.3696L37.6037 28.8345L44.6109 28.807C44.6109 28.807 46.0792 28.7544 46.842 28.0798L46.8412 28.0806Z" fill="#00B033"/>
  </g>
  <defs>
    <clipPath id="clip0_3133_16115">
      <rect width="48" height="48" fill="white"/>
    </clipPath>
  </defs>
  </svg>`;

const FaviconHelmet = () => {
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;
    const oldLinks = head.querySelectorAll(
      "link[rel='icon'], link[rel='shortcut icon'], link[rel='alternate icon']",
    );
    oldLinks.forEach((el) => el.parentNode && el.parentNode.removeChild(el));

    const add = (rel) => {
      const link = document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute('type', 'image/svg+xml');
      link.setAttribute('href', dataUrl);
      head.appendChild(link);
    };
    add('icon');
    add('shortcut icon');
    add('alternate icon');
  }, [dataUrl]);
  return (
    <Helmet>
      <link rel="icon" type="image/svg+xml" sizes="any" href={dataUrl} />
      <link rel="shortcut icon" type="image/svg+xml" href={dataUrl} />
      <link rel="alternate icon" type="image/svg+xml" href={dataUrl} />
      <link rel="apple-touch-icon" href={dataUrl} />
    </Helmet>
  );
};

export default FaviconHelmet;
