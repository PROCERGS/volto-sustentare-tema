import { useEffect, useState } from 'react';

const ENERGY_PER_MB = 0.000193; // kWh por MB transferido
const CO2_PER_KWH = 38.5; // gramas de CO2 por kWh (valores da última medição feita em 2023)

function getPageSizeMB() {
  let totalBytes = 0;
  if (performance && performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource');
    resources.forEach((res) => {
      if (res.transferSize) totalBytes += res.transferSize;
    });
  }
  // Adiciona tamanho do HTML principal
  if (
    document &&
    document.documentElement &&
    document.documentElement.innerHTML
  ) {
    totalBytes += new Blob([document.documentElement.innerHTML]).size;
  }
  return totalBytes / (1024 * 1024); // MB
}

export function useCO2Estimate() {
  const [co2, setCO2] = useState(null);

  useEffect(() => {
    const sizeMB = getPageSizeMB();
    const energy = sizeMB * ENERGY_PER_MB; // kWh
    const co2Estimate = energy * CO2_PER_KWH; // gramas
    setCO2(co2Estimate);
  }, []);

  return co2; // valor em gramas
}
