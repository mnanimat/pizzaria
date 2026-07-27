/**
 * Security & Rate Limiting Module for Cloudflare Pages & Web App Shield
 * Provides rate limiting, honeypot protection, input sanitization, and DoS guard.
 */

const ORDER_RATE_LIMIT_KEY = 'mnanimat_order_security_logs_v1';

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  retryAfterSeconds?: number;
}

export interface SecurityMetrics {
  isShieldActive: boolean;
  ordersPlacedInWindow: number;
  maxOrdersInWindow: number;
  timeWindowMinutes: number;
  cooldownRemainingSeconds: number;
}

// Security Configuration
export const SECURITY_CONFIG = {
  MIN_INTERVAL_SECONDS: 45, // Minimum time between consecutive orders
  MAX_ORDERS_IN_WINDOW: 3,  // Max orders allowed in window
  WINDOW_MINUTES: 10,       // Time window in minutes
  MAX_DAILY_ORDERS: 10,     // Max orders per 24 hours per device
  MAX_FIELD_LENGTH: 250,    // Max allowed length for customer text inputs
};

interface OrderLogEntry {
  timestamp: number; // Unix timestamp in ms
}

/**
 * Sanitizes input strings to prevent HTML/XSS injection and cuts off excessive length.
 */
export function sanitizeText(input: string, maxLength: number = SECURITY_CONFIG.MAX_FIELD_LENGTH): string {
  if (!input) return '';
  
  // Strip potential script tags, HTML tags, and dangerous code snippets
  let cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '');

  // Trim whitespace and enforce length caps
  cleaned = cleaned.trim();
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  return cleaned;
}

/**
 * Retrieves past order timestamps stored locally with error recovery.
 */
function getOrderLogs(): OrderLogEntry[] {
  try {
    const raw = localStorage.getItem(ORDER_RATE_LIMIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item.timestamp === 'number');
  } catch {
    // If storage is corrupted or disabled, reset cleanly
    try {
      localStorage.removeItem(ORDER_RATE_LIMIT_KEY);
    } catch {
      /* ignore */
    }
    return [];
  }
}

/**
 * Saves order logs to localStorage safely.
 */
function saveOrderLogs(logs: OrderLogEntry[]): void {
  try {
    localStorage.setItem(ORDER_RATE_LIMIT_KEY, JSON.stringify(logs));
  } catch (err) {
    console.warn('Storage security log warning:', err);
  }
}

/**
 * Checks if the current client is allowed to place a new order or if rate limit is triggered.
 */
export function checkOrderRateLimit(): SecurityCheckResult {
  const now = Date.now();
  const logs = getOrderLogs();

  // 1. Check minimum interval between orders (cooldown)
  if (logs.length > 0) {
    const lastOrder = logs[logs.length - 1];
    const elapsedSeconds = Math.floor((now - lastOrder.timestamp) / 1000);
    const cooldownNeeded = SECURITY_CONFIG.MIN_INTERVAL_SECONDS - elapsedSeconds;

    if (cooldownNeeded > 0) {
      return {
        allowed: false,
        reason: `Por medida de segurança anti-spam, aguarde ${cooldownNeeded} segundo(s) para enviar outro pedido.`,
        retryAfterSeconds: cooldownNeeded,
      };
    }
  }

  // 2. Check orders in the 10-minute sliding window
  const windowMs = SECURITY_CONFIG.WINDOW_MINUTES * 60 * 1000;
  const ordersInWindow = logs.filter((entry) => now - entry.timestamp < windowMs);

  if (ordersInWindow.length >= SECURITY_CONFIG.MAX_ORDERS_IN_WINDOW) {
    const oldestInWindow = ordersInWindow[0];
    const timeToWaitMs = windowMs - (now - oldestInWindow.timestamp);
    const timeToWaitSec = Math.ceil(timeToWaitMs / 1000);

    return {
      allowed: false,
      reason: `Limite de segurança atingido (${SECURITY_CONFIG.MAX_ORDERS_IN_WINDOW} pedidos a cada ${SECURITY_CONFIG.WINDOW_MINUTES} min). Por favor, aguarde ${Math.ceil(timeToWaitSec / 60)} min antes de realizar outro pedido.`,
      retryAfterSeconds: timeToWaitSec,
    };
  }

  // 3. Check daily limit (24 hours)
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  const ordersInDay = logs.filter((entry) => now - entry.timestamp < twentyFourHoursMs);

  if (ordersInDay.length >= SECURITY_CONFIG.MAX_DAILY_ORDERS) {
    return {
      allowed: false,
      reason: `Você atingiu o limite diário de segurança (${SECURITY_CONFIG.MAX_DAILY_ORDERS} pedidos por dia neste dispositivo). Caso precise de suporte, entre em contato direto pelo WhatsApp.`,
      retryAfterSeconds: 3600,
    };
  }

  return { allowed: true };
}

/**
 * Records a newly completed order attempt into rate limiter logs.
 */
export function recordOrderPlaced(): void {
  const now = Date.now();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  
  // Keep only logs within last 24h to avoid storage bloat
  const currentLogs = getOrderLogs().filter((entry) => now - entry.timestamp < twentyFourHoursMs);
  currentLogs.push({ timestamp: now });
  
  saveOrderLogs(currentLogs);
}

/**
 * Gets real-time security stats for UI widgets.
 */
export function getSecurityMetrics(): SecurityMetrics {
  const now = Date.now();
  const logs = getOrderLogs();
  const windowMs = SECURITY_CONFIG.WINDOW_MINUTES * 60 * 1000;
  
  const ordersInWindow = logs.filter((entry) => now - entry.timestamp < windowMs);
  
  let cooldownRemainingSeconds = 0;
  if (logs.length > 0) {
    const lastOrderTimestamp = logs[logs.length - 1].timestamp;
    const elapsedSeconds = Math.floor((now - lastOrderTimestamp) / 1000);
    cooldownRemainingSeconds = Math.max(0, SECURITY_CONFIG.MIN_INTERVAL_SECONDS - elapsedSeconds);
  }

  return {
    isShieldActive: true,
    ordersPlacedInWindow: ordersInWindow.length,
    maxOrdersInWindow: SECURITY_CONFIG.MAX_ORDERS_IN_WINDOW,
    timeWindowMinutes: SECURITY_CONFIG.WINDOW_MINUTES,
    cooldownRemainingSeconds,
  };
}

/**
 * Honeypot validation trap. If value is present, it means a bot auto-filled the hidden field.
 */
export function isBotSubmission(honeypotValue: string): boolean {
  return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0;
}
