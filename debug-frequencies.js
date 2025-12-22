// Script para debug - buscar TODOS os recursos
const axios = require('axios');

const CLOUDINARY_CLOUD_NAME = 'dghzftqkj';
const CLOUDINARY_API_KEY = '669128232276245';
const CLOUDINARY_API_SECRET = 'BALTsh-YCMYDEmfvaaOLeRAAVbE';

const api = axios.create({
    baseURL: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}`,
    headers: {
        Authorization: `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')}`,
    },
});

async function findAllAudios() {
    try {
        console.log('🔍 Buscando TODOS os recursos de áudio/vídeo...\n');

        // Tentar diferentes tipos
        const types = ['video', 'raw'];

        for (const resourceType of types) {
            console.log(`\n📦 Tipo: ${resourceType}`);
            console.log('─'.repeat(60));

            try {
                const { data } = await api.get(`/resources/${resourceType}`, {
                    params: {
                        type: 'upload',
                        max_results: 500,
                    },
                });

                console.log(`   Total de recursos: ${data.resources.length}\n`);

                // Agrupar por pasta
                const byFolder = {};

                data.resources.forEach(resource => {
                    const parts = resource.public_id.split('/');
                    const folder = parts.length > 1 ? parts[0] : 'root';

                    if (!byFolder[folder]) {
                        byFolder[folder] = [];
                    }
                    byFolder[folder].push(resource.public_id);
                });

                // Mostrar agrupado
                Object.keys(byFolder).sort().forEach(folder => {
                    console.log(`\n   📁 ${folder} (${byFolder[folder].length} arquivos):`);
                    byFolder[folder].forEach((id, index) => {
                        const fileName = id.split('/').pop();
                        console.log(`      ${index + 1}. ${fileName}`);
                    });
                });

            } catch (error) {
                console.log(`   ❌ Erro: ${error.message}`);
            }
        }

        console.log('\n\n✨ Debug concluído!\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

findAllAudios();
