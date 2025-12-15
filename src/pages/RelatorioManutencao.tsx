import React from 'react';
import RelatorioBase, { type RelatorioFormData } from '../components/RelatorioBase';

const RelatorioManutencao: React.FC = () => {
  const handlePesquisar = (dados: RelatorioFormData) => {
    console.log('Gerar relatório manutenção:', dados);
    alert('Relatório Manutenção gerado com sucesso! (Funcionalidade em desenvolvimento)');
  };

  return (
    <RelatorioBase
      titulo="RELATÓRIO - MANUTENÇÃO"
      descricao="Este relatório apresenta informações sobre manutenções realizadas, agendadas e pendentes para os veículos da frota."
      onPesquisar={handlePesquisar}
    />
  );
};

export default RelatorioManutencao;
