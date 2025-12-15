import React from 'react';
import RelatorioBase, { type RelatorioFormData } from '../components/RelatorioBase';

const RelatorioViagem: React.FC = () => {
  const handlePesquisar = (dados: RelatorioFormData) => {
    console.log('Gerar relatório viagem:', dados);
    alert('Relatório Viagem gerado com sucesso! (Funcionalidade em desenvolvimento)');
  };

  return (
    <RelatorioBase
      titulo="RELATÓRIO - VIAGEM"
      descricao="Este relatório detalha todas as viagens realizadas pelos veículos, incluindo origem, destino, distância percorrida e tempo de viagem."
      onPesquisar={handlePesquisar}
    />
  );
};

export default RelatorioViagem;
