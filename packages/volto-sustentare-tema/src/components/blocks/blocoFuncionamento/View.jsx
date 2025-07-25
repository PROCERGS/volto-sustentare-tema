import './BlocoSust.css';
import Camada_1 from './img/Camada_1.svg';
import Camada_2 from './img/Camada_2.svg';
import Camada_3 from './img/Camada_3.svg';
import Camada_4 from './img/Camada_4.svg';
import Camada_5 from './img/Camada_5.svg';
import Camada_6 from './img/Camada_6.svg';
import Camada_7 from './img/Camada_7.svg';
import Hover1 from './hover/Hover1.svg';
import Hover2 from './hover/Hover2.svg';
import Hover3 from './hover/Hover3.svg';
import Hover4 from './hover/Hover4.svg';
import Hover5 from './hover/Hover5.svg';
import Hover6 from './hover/Hover6.svg';
import Hover7 from './hover/Hover7.svg';

import vector1 from './vectors/Vector1.svg';
import vector3 from './vectors/Vector3.svg';
import vector2 from './vectors/Vector2.svg';
import vector1_2 from './vectors/vector1-2.svg';
import vector2_1 from './vectors/vector2-1.svg';
import vector4 from './vectors/Vector4.svg';
import vector5 from './vectors/Vector5.svg';
import vector6 from './vectors/Vector6.svg';

const BlocoSustView = () => {
  return (
    <div className="bloco-comoFunciona">
      <h1 className="sust-title">como o sustentare funciona</h1>
      <div className="sust-container">
        <div className="sust-one-to-another first">
          <div className="sust-item one">
            <img
              src={Camada_1}
              alt="Bloco Sust"
              style={{ height: '144px', width: '145px' }}
              onMouseEnter={(e) => (e.target.src = Hover1)}
              onMouseLeave={(e) => (e.target.src = Camada_1)}
            />
            <div className="sust-item-text" style={{ placeContent: 'end' }}>
              <span className="span-title">Recolhimento do material</span>
              <span className="span-text">Pontos de coleta estabelecidos</span>
            </div>
          </div>

          <img src={vector1} alt="vector" className="vector1" />

          <div className="sust-item two">
            <img
              src={Camada_2}
              alt="Bloco Sust"
              style={{ height: '155px', width: '134px' }}
              onMouseEnter={(e) => (e.target.src = Hover2)}
              onMouseLeave={(e) => (e.target.src = Camada_2)}
            />
            <div className="sust-item-text">
              <span className="span-title">Triagem</span>
              <span className="span-text">Feita em tal lugar do projeto</span>
            </div>
          </div>
        </div>

        <div className="sust-meio">
          <div className="sust-one-to-another">
            <img src={vector1_2} alt="vector" className="vector1_2 hidden" />
            <img src={vector5} alt="vector" className="vector5 medium" />
            <img src={vector3} alt="vector" className="vector3 gone" />
            <div className="sust-meio-itens">
              <div className="sust-item">
                <img
                  src={Camada_3}
                  alt="Bloco Sust"
                  style={{ height: '96px', width: '108px' }}
                  onMouseEnter={(e) => (e.target.src = Hover3)}
                  onMouseLeave={(e) => (e.target.src = Camada_3)}
                />
                <div className="sust-item-text">
                  <span className="span-title">Recuperáveis</span>
                  <span className="span-text">
                    Recondicionamento de peças e softwares
                  </span>
                </div>
              </div>

              <div className="sust-item">
                <img
                  src={Camada_4}
                  alt="Bloco Sust"
                  style={{ height: '106px', width: '94px' }}
                  onMouseEnter={(e) => (e.target.src = Hover4)}
                  onMouseLeave={(e) => (e.target.src = Camada_4)}
                />
                <div className="sust-item-text">
                  <span className="span-title">Ociosos</span>
                  <span className="span-text">
                    Separação e levantamento de necessidades
                  </span>
                </div>
              </div>
              <div className="sust-item gone medium">
                <img
                  src={Camada_5}
                  alt="Bloco Sust"
                  style={{ height: '106px', width: '156px' }}
                  onMouseEnter={(e) => (e.target.src = Hover5)}
                  onMouseLeave={(e) => (e.target.src = Camada_5)}
                />
                <div className="sust-item-text">
                  <span className="span-title">Irrecuperáveis</span>
                  <span className="span-text">
                    Reciclagem assistida onde componentes passam pela
                    descaracterização
                  </span>
                </div>
              </div>
            </div>
          </div>

          <img src={vector2_1} alt="vector" className="vector2_1 hidden" />
          <div className="vectors-medium medium">
            <img src={vector4} alt="vector" className="vector4" />
            <img src={vector6} alt="vector" className="vector6" />
          </div>

          <div className="sust-one-to-another">
            <div className="sust-two-vectors gone">
              <div
                style={{
                  height: '100%',
                  width: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  paddingBottom: '30px',
                }}
              >
                <div className="sust-two-vector ">
                  <img
                    src={vector2}
                    alt="vector"
                    className="vector2"
                    style={{ transform: 'translateX(20%) translateY(80%)' }}
                  />
                </div>

                <div className="sust-two-vector ">
                  <img src={vector1} alt="vector" className="vector1" />
                </div>

                <div className="sust-two-vector">
                  <img src={vector1} alt="vector" className="vector1" />
                </div>
              </div>
            </div>

            <div className="sust-two-vectors two-vectors-final">
              <div className="two-vectors-container">
                <div className="sust-two-vector">
                  <div className="sust-item">
                    <img
                      src={Camada_6}
                      alt="Bloco Sust"
                      style={{ height: '130px', width: '92px' }}
                      onMouseEnter={(e) => (e.target.src = Hover6)}
                      onMouseLeave={(e) => (e.target.src = Camada_6)}
                    />
                    <div className="sust-item-text">
                      <span className="span-title">Doação</span>
                      <span className="span-text">
                        Para instituições necessitadas cadastradas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sust-two-vector gone medium">
                  <div className="sust-item">
                    <img
                      src={Camada_7}
                      alt="Bloco Sust"
                      style={{ height: '82px', width: '117px' }}
                      onMouseEnter={(e) => (e.target.src = Hover7)}
                      onMouseLeave={(e) => (e.target.src = Camada_7)}
                    />
                    <div className="sust-item-text">
                      <span className="span-title">
                        reaproveitamento pela indústria
                      </span>
                      <span className="span-text">
                        Envio para empresas que reaproveitam pó residual
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden subtexto-reaproveitamento">
              <h1 className="hidden">Em caso de não reaproveitamento:</h1>
              <div className="sust-one-to-another">
                <div className="sust-item hidden">
                  <img
                    src={Camada_5}
                    alt="Bloco Sust"
                    style={{ height: '190px', width: '156px' }}
                    onMouseEnter={(e) => (e.target.src = Hover5)}
                    onMouseLeave={(e) => (e.target.src = Camada_5)}
                  />
                  <div
                    className="sust-item-text"
                    style={{ placeContent: 'end' }}
                  >
                    <span className="span-title">Irrecuperáveis</span>
                    <span className="span-text">
                      Reciclagem assistida onde componentes passam pela
                      descaracterização
                    </span>
                  </div>
                </div>

                <img src={vector1} alt="vector" className="vector1 hidden" />

                <div className="sust-item hidden">
                  <img
                    src={Camada_7}
                    alt="Bloco Sust"
                    style={{ height: '82px', width: '117px' }}
                    onMouseEnter={(e) => (e.target.src = Hover7)}
                    onMouseLeave={(e) => (e.target.src = Camada_7)}
                  />
                  <div className="sust-item-text">
                    <span className="span-title">
                      Reaproveitamento pela indústria
                    </span>
                    <span className="span-text">
                      Envio para empresas que reaproveitam pó residual
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlocoSustView;
