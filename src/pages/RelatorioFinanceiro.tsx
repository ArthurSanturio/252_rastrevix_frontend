import React from 'react';
import RelatorioBase, { type RelatorioFormData } from '../components/RelatorioBase';

const RelatorioFinanceiro: React.FC = () => {
  const handlePesquisar = (dados: RelatorioFormData) => {
    console.log('Gerar relatório financeiro:', dados);
    alert('Relatório Financeiro gerado com sucesso! (Funcionalidade em desenvolvimento)');
  };

  return (
    <RelatorioBase
      titulo="RELATÓRIO - FINANCEIRO"
      descricao="Este relatório apresenta informações financeiras consolidadas, incluindo custos operacionais, receitas e indicadores financeiros."
      onPesquisar={handlePesquisar}
    />
  );
};

export default RelatorioFinanceiro;
