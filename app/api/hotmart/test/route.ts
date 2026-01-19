import { NextResponse } from 'next/server';

/**
 * GET /api/hotmart/test
 * 
 * Endpoint para testar integração Hotmart em desenvolvimento
 * Simula um webhook de compra aprovada
 */
export async function GET() {
    const testPayload = {
        id: 'test-' + Date.now(),
        event: 'PURCHASE_COMPLETE',
        creation_date: Math.floor(Date.now() / 1000),
        data: {
            product: {
                id: 123456,
                name: 'World Autistic - Acesso Completo',
                ucode: 'test-product',
            },
            buyer: {
                email: 'teste@exemplo.com',
                name: 'Cliente Teste',
            },
            purchase: {
                transaction: 'TEST_TRANS_' + Date.now(),
                status: 'approved',
                order_date: Math.floor(Date.now() / 1000),
                approved_date: Math.floor(Date.now() / 1000),
                price: {
                    value: 97.00,
                    currency_code: 'BRL',
                },
                payment: {
                    type: 'CREDIT_CARD',
                },
            },
        },
    };

    return NextResponse.json({
        message: 'Endpoint de teste - use este payload para testar o webhook',
        payload: testPayload,
        instructions: [
            '1. Copie o payload acima',
            '2. Faça um POST para /api/hotmart/webhook',
            '3. Inclua o header: x-hotmart-hottok com o valor do .env',
            '4. Verifique o banco de dados para confirmar criação do usuário',
        ],
    });
}

/**
 * POST /api/hotmart/test
 * 
 * Envia automaticamente um webhook de teste para o endpoint principal
 */
export async function POST() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const webhookSecret = process.env.HOTMART_WEBHOOK_SECRET || 'test-secret';

    const testPayload = {
        id: 'test-' + Date.now(),
        event: 'PURCHASE_COMPLETE',
        creation_date: Math.floor(Date.now() / 1000),
        data: {
            product: {
                id: 123456,
                name: 'World Autistic - Acesso Completo',
            },
            buyer: {
                email: 'teste@exemplo.com',
                name: 'Cliente Teste',
            },
            purchase: {
                transaction: 'TEST_TRANS_' + Date.now(),
                status: 'approved',
                order_date: Math.floor(Date.now() / 1000),
                approved_date: Math.floor(Date.now() / 1000),
                price: {
                    value: 97.00,
                    currency_code: 'BRL',
                },
                payment: {
                    type: 'CREDIT_CARD',
                },
            },
        },
    };

    try {
        const response = await fetch(`${baseUrl}/api/hotmart/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hotmart-hottok': webhookSecret,
            },
            body: JSON.stringify(testPayload),
        });

        const result = await response.json();

        return NextResponse.json({
            success: true,
            message: 'Webhook de teste enviado',
            webhookResponse: result,
            testPayload,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
