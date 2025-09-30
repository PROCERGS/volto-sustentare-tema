const BlocoEspacador = ({ data }) => {
  const height = data.height || 30;
  return <div style={{ height: `${height}px` }} />;
};

export default BlocoEspacador;
