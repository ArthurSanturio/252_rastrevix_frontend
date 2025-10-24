// Script de debug para o frontend
console.log('🔍 Debug do Frontend - Serviço de Máquinas');

// Verificar se o serviço está sendo importado corretamente
try {
    // Simular a importação do serviço
    console.log('📦 Verificando importação do maquinaService...');

    // Verificar se o localStorage tem token
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Token no localStorage:', token ? 'Presente' : 'Ausente');

    if (token) {
        console.log('✅ Token encontrado, testando API...');

        // Testar a API diretamente
        fetch('http://localhost:3001/api/maquinas', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('📡 Status da resposta:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('📊 Dados recebidos:', data);
                console.log('📋 Total de máquinas:', data.data?.maquinas?.length || 0);
            })
            .catch(error => {
                console.error('❌ Erro na requisição:', error);
            });
    } else {
        console.log('⚠️ Nenhum token encontrado. Faça login primeiro.');
    }

} catch (error) {
    console.error('❌ Erro no debug:', error);
}

// Função para testar o serviço de máquinas
window.testMaquinaService = async function () {
    console.log('🧪 Testando serviço de máquinas...');

    try {
        // Importar o serviço dinamicamente
        const { maquinaService } = await import('./src/services/maquinaService.ts');

        console.log('📦 Serviço importado:', maquinaService);
        console.log('🔧 Métodos disponíveis:', Object.getOwnPropertyNames(Object.getPrototypeOf(maquinaService)));

        // Testar listagem
        const response = await maquinaService.listarMaquinas();
        console.log('✅ Resposta do serviço:', response);

    } catch (error) {
        console.error('❌ Erro ao testar serviço:', error);
    }
};

console.log('💡 Execute testMaquinaService() no console para testar o serviço');
