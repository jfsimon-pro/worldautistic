import crypto from 'crypto';

// ============================================
// 🔐 VALIDAÇÃO DE WEBHOOK HOTMART
// ============================================

/**
 * Valida se o webhook recebido é autêntico da Hotmart
 * Hotmart envia um header X-Hotmart-Hottok com o código de segurança
 */
export function validateHotmartWebhook(hottok: string | null): boolean {
  const expectedToken = process.env.HOTMART_WEBHOOK_SECRET;
  
  if (!expectedToken) {
    console.warn('⚠️ HOTMART_WEBHOOK_SECRET não configurado no .env');
    // Em desenvolvimento, aceitar sem validação (REMOVER EM PRODUÇÃO)
    return process.env.NODE_ENV === 'development';
  }
  
  return hottok === expectedToken;
}

// ============================================
// 📦 TIPOS DO PAYLOAD HOTMART
// ============================================

export type HotmartEventType = 
  | 'PURCHASE_APPROVED'
  | 'PURCHASE_COMPLETE'
  | 'PURCHASE_CANCELED'
  | 'PURCHASE_REFUNDED'
  | 'PURCHASE_CHARGEBACK'
  | 'SUBSCRIPTION_CANCELLATION'
  | 'SUBSCRIPTION_REACTIVATION';

export interface HotmartWebhookPayload {
  id: string;
  event: HotmartEventType;
  creation_date: number; // timestamp
  data: {
    product: {
      id: number;
      name: string;
      ucode?: string;
    };
    buyer: {
      email: string;
      name: string;
      checkout_phone?: string;
      phone_local_code?: string;
    };
    purchase: {
      transaction: string;
      status: string;
      order_date: number;
      approved_date?: number;
      price: {
        value: number;
        currency_code: string;
      };
      payment: {
        type: string;
        method?: string;
      };
      recurrency_number?: number;
    };
    subscription?: {
      subscriber: {
        code: string;
      };
      status: string;
      plan: {
        id: number;
        name: string;
      };
    };
    producer?: {
      name: string;
    };
    commissions?: Array<{
      currency_code: string;
      source: string;
      value: number;
    }>;
  };
}

// ============================================
// 🔄 PARSE DE EVENTOS
// ============================================

export interface ParsedHotmartData {
  transactionId: string;
  productId: string;
  productName: string;
  buyerEmail: string;
  buyerName: string;
  amount: number;
  currency: string;
  purchaseDate: Date;
  approvedDate?: Date;
  isRecurrent: boolean;
  subscriptionId?: string;
  subscriptionStatus?: string;
  status: 'APPROVED' | 'COMPLETE' | 'CANCELED' | 'REFUNDED' | 'CHARGEBACK' | 'EXPIRED';
  rawData: any;
}

/**
 * Faz parse do payload da Hotmart para formato mais utilizável
 */
export function parseHotmartEvent(payload: HotmartWebhookPayload): ParsedHotmartData {
  const { data, event } = payload;
  
  // Determinar status baseado no evento
  let status: ParsedHotmartData['status'] = 'APPROVED';
  switch (event) {
    case 'PURCHASE_COMPLETE':
      status = 'COMPLETE';
      break;
    case 'PURCHASE_CANCELED':
    case 'SUBSCRIPTION_CANCELLATION':
      status = 'CANCELED';
      break;
    case 'PURCHASE_REFUNDED':
      status = 'REFUNDED';
      break;
    case 'PURCHASE_CHARGEBACK':
      status = 'CHARGEBACK';
      break;
    default:
      status = 'APPROVED';
  }
  
  return {
    transactionId: data.purchase.transaction,
    productId: data.product.id.toString(),
    productName: data.product.name,
    buyerEmail: data.buyer.email.toLowerCase().trim(),
    buyerName: data.buyer.name,
    amount: data.purchase.price.value,
    currency: data.purchase.price.currency_code,
    purchaseDate: new Date(data.purchase.order_date * 1000),
    approvedDate: data.purchase.approved_date 
      ? new Date(data.purchase.approved_date * 1000) 
      : undefined,
    isRecurrent: !!data.subscription,
    subscriptionId: data.subscription?.subscriber.code,
    subscriptionStatus: data.subscription?.status,
    status,
    rawData: payload,
  };
}

// ============================================
// 📅 CÁLCULO DE EXPIRAÇÃO
// ============================================

/**
 * Calcula data de expiração do acesso
 * @param isRecurrent - Se é assinatura recorrente (mensal/anual)
 * @param customDays - Dias customizados (opcional)
 */
export function calculateExpirationDate(
  isRecurrent: boolean = false,
  customDays?: number
): Date {
  const expiresAt = new Date();
  
  if (customDays) {
    expiresAt.setDate(expiresAt.getDate() + customDays);
  } else if (isRecurrent) {
    // Assinatura recorrente: normalmente 30 dias (mensal)
    // Hotmart renova automaticamente
    expiresAt.setDate(expiresAt.getDate() + 35); // 35 dias para dar margem
  } else {
    // Produto único: acesso vitalício ou por período definido
    const defaultDays = parseInt(process.env.DEFAULT_SUBSCRIPTION_DAYS || '365', 10);
    expiresAt.setDate(expiresAt.getDate() + defaultDays);
  }
  
  return expiresAt;
}

// ============================================
// 🔑 GERAÇÃO DE SENHA TEMPORÁRIA
// ============================================

/**
 * Gera senha temporária segura para novos usuários
 * Formato: Palavra-fácil + 4 dígitos + símbolo
 * Exemplo: "Piano2847!"
 */
export function generateTemporaryPassword(): string {
  const words = [
    'Piano', 'Violao', 'Estrela', 'Oceano', 'Monte',
    'Jardim', 'Livro', 'Luz', 'Tempo', 'Mundo',
    'Sonho', 'Arte', 'Vida', 'Ceu', 'Sol'
  ];
  
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  const symbols = '!@#$%';
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  return `${randomWord}${randomNumbers}${randomSymbol}`;
}

/**
 * Gera senha aleatória completamente segura (alternativa)
 */
export function generateSecurePassword(length: number = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  
  return password;
}

// ============================================
// 🔍 HELPERS DE VALIDAÇÃO
// ============================================

/**
 * Valida se email é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se produto ID está configurado (opcional)
 */
export function isValidProductId(productId: string): boolean {
  const allowedProductId = process.env.HOTMART_PRODUCT_ID;
  
  // Se não configurou produto específico, aceitar qualquer um
  if (!allowedProductId) {
    return true;
  }
  
  return productId === allowedProductId;
}
