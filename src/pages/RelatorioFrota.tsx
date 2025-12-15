import React from 'react';
import RelatorioBase, { type RelatorioFormData } from '../components/RelatorioBase';

const RelatorioFrota: React.FC = () => {
  const handlePesquisar = (dados: RelatorioFormData) => {
    console.log('Gerar relatório frota:', dados);
    alert('Relatório Frota gerado com sucesso! (Funcionalidade em desenvolvimento)');
  };

  return (
    <RelatorioBase
      titulo="RELATÓRIO - FROTA"
      descricao="Este relatório apresenta informações consolidadas sobre toda a frota, incluindo status dos veículos, utilização e desempenho geral."
      onPesquisar={handlePesquisar}
    />
  );
};

export default RelatorioFrota;
