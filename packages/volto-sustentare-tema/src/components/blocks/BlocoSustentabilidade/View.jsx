import React from 'react';
import './Sustentabilidade.css';

const BlocoSustentabilidade = ({ data = {} }) => (
  <section className="bloco-sustentabilidade">
    <div className="sustentabilidade-coluna-esquerda">
      <h2>
        SUSTENTABILIDADE COM{'\n'}
        <br className="quebraLinha" />
        <span> RESULTADOS REAIS:{'\n'}</span>
        <br className="quebraLinha" />
        MENOS DESCARTE, MAIS{'\n'}
        <br className="quebraLinha" />
        INCLUSÃO E EFICIÊNCIA NA{'\n'}
        <br className="quebraLinha" />
        GESTÃO PÚBLICA
      </h2>
      <p>
        Dados coletados até o ano de 2022, do funcionamento do Sustentare desde
        sua implementação em 2016.
      </p>
      <a href="/">SAIBA MAIS</a>
    </div>
    <div className="sustentabilidade-coluna-direita">
      <div className="sustentabilidade-box">
        <span className="sustentabilidade-numeros">
          {data.num_equipamentos}
        </span>
        <span className="sustentabilidade-descricao">
          Equipamentos eletroeletrônicos
          <br />
          recolhidos
        </span>
      </div>
      <div className="sustentabilidade-box">
        <span className="sustentabilidade-numeros">
          {data.num_recondicionados}
        </span>
        <span className="sustentabilidade-descricao">
          Equipamentos
          <br />
          recondicionados
          <br />e doados
        </span>
      </div>
      <div className="sustentabilidade-box">
        <span className="sustentabilidade-numeros">{data.num_toneladas}</span>
        <span className="sustentabilidade-descricao">
          Toneladas de material
          <br />
          descaracterizado
          <br />
          de maneira segura
        </span>
      </div>
      <div className="sustentabilidade-box">
        <span className="sustentabilidade-numeros">{data.num_entidades}</span>
        <span className="sustentabilidade-descricao">
          Entidades sociais
          <br />e instituições
          <br />
          beneficiadas
        </span>
      </div>
    </div>
    <div className="sustentabilidade-coluna-esquerda">
      <a className="sustentabilidade-link-hidden" href="/">
        SAIBA MAIS
      </a>
    </div>
  </section>
);

export default BlocoSustentabilidade;
