// Script para testar o serviço de máquinas no frontend
console.log('🧪 Testando serviço de máquinas no frontend...\n');

// Simular o ambiente do frontend
const mockApiService = {
    request: async (endpoint, options = {}) => {
        console.log(`📡 Fazendo requisição para: ${endpoint}`);

        const baseURL = 'http://localhost:3001/api';
        const url = `${baseURL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                method: options.method || 'GET',
                headers,
                body: options.body
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ Resposta recebida:`, data);
            return data;
        } catch (error) {
            console.error(`❌ Erro na requisição:`, error.message);
            throw error;
        }
    }
};

// Simular o serviço de máquinas
class MaquinaService {
    constructor() {
        this.baseEndpoint = '/maquinas';
    }

    async listarMaquinas(params = {}) {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.tipo) queryParams.append('tipo', params.tipo);

        const endpoint = queryParams.toString()
            ? `${this.baseEndpoint}?${queryParams.toString()}`
            : this.baseEndpoint;

        return mockApiService.request(endpoint);
    }
}

// Teste
async function testarServicoMaquinas() {
    const maquinaService = new MaquinaService();

    try {
        console.log('1️⃣ Testando listagem de máquinas...');
        const response = await maquinaService.listarMaquinas();

        console.log(`📊 Total de máquinas: ${response.data.maquinas.length}`);
        console.log('📋 Máquinas encontradas:');
        response.data.maquinas.forEach((maquina, index) => {
            console.log(`  ${index + 1}. ${maquina.nome} (${maquina.codigo}) - ${maquina.status}`);
            console.log(`     Localização: ${maquina.localizacao || 'Não informada'}`);
        });

        console.log('\n2️⃣ Testando filtros...');
        const responseFiltrada = await maquinaService.listarMaquinas({ status: 'ativa' });
        console.log(`📊 Máquinas ativas: ${responseFiltrada.data.maquinas.length}`);

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

// Executar teste
testarServicoMaquinas();
