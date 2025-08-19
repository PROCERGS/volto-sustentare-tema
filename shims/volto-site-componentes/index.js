// Local shim for CI/acceptance: provides minimal exports so builds don’t fail
// Default export: no-op applyConfig
export default function applyConfig(config) {
  return config;
}

// Named exports used by Header.jsx
export function BarraEstado() {
  return null;
}

export function BarraAcessibilidade() {
  return null;
}
