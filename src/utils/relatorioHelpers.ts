// Helper functions para relatórios

export const formatarData = (data: Date): string => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const definirPeriodoHoje = () => {
  const hoje = new Date();
  return {
    dataInicio: formatarData(hoje),
    dataFim: formatarData(hoje),
    horaInicio: '00:00',
    horaFim: '23:59'
  };
};

export const definirPeriodoEsseMes = () => {
  const hoje = new Date();
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  return {
    dataInicio: formatarData(primeiroDia),
    dataFim: formatarData(ultimoDia),
    horaInicio: '00:00',
    horaFim: '23:59'
  };
};

export const calcularPeriodoRapido = (
  periodo: 'hoje' | 'ontem' | 'dois-dias' | 'tres-dias' | 'esse-mes' | 'mes-anterior' | 'dois-meses' | 'tres-meses'
) => {
  const hoje = new Date();
  let dataInicio = new Date();
  let dataFim = new Date();

  switch (periodo) {
    case 'hoje':
      dataInicio = new Date(hoje);
      dataFim = new Date(hoje);
      break;
    case 'ontem':
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - 1);
      dataFim = new Date(dataInicio);
      break;
    case 'dois-dias':
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - 2);
      dataFim = new Date(hoje);
      break;
    case 'tres-dias':
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - 3);
      dataFim = new Date(hoje);
      break;
    case 'esse-mes':
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      break;
    case 'mes-anterior':
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      break;
    case 'dois-meses':
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      break;
    case 'tres-meses':
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      break;
  }

  return {
    dataInicio: formatarData(dataInicio),
    dataFim: formatarData(dataFim),
    horaInicio: periodo.startsWith('esse-mes') || periodo.startsWith('mes-anterior') || periodo.startsWith('dois-meses') || periodo.startsWith('tres-meses') ? '00:00' : (periodo === 'hoje' ? '00:00' : '00:00'),
    horaFim: periodo.startsWith('esse-mes') || periodo.startsWith('mes-anterior') || periodo.startsWith('dois-meses') || periodo.startsWith('tres-meses') ? '23:59' : (periodo === 'hoje' ? '23:59' : '23:59')
  };
};
