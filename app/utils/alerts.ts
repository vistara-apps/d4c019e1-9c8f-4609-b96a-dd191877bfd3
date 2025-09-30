import { Alert, AlertConfig } from '../types';

// Local storage key for alerts
const ALERTS_STORAGE_KEY = 'token-pulse-alerts';

// Get all alerts from localStorage
export const getAlerts = (): Alert[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (!stored) return [];

    const alerts = JSON.parse(stored);
    return alerts.map((alert: any) => ({
      ...alert,
      createdAt: new Date(alert.createdAt),
      triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load alerts:', error);
    return [];
  }
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Save alerts to localStorage
export const saveAlerts = (alerts: Alert[]): void => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (error) {
    console.error('Failed to save alerts:', error);
  }
};

// Create a new alert
export const createAlert = (config: AlertConfig): Alert => {
  const alert: Alert = {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tokenId: config.tokenId,
    alertType: config.type,
    threshold: config.threshold,
    comparison: config.comparison,
    status: 'active',
    createdAt: new Date(),
  };

  const alerts = getAlerts();
  alerts.push(alert);
  saveAlerts(alerts);

  return alert;
};

// Update an alert
export const updateAlert = (id: string, updates: Partial<Alert>): void => {
  const alerts = getAlerts();
  const index = alerts.findIndex(alert => alert.id === id);

  if (index !== -1) {
    alerts[index] = { ...alerts[index], ...updates };
    saveAlerts(alerts);
  }
};

// Delete an alert
export const deleteAlert = (id: string): void => {
  const alerts = getAlerts();
  const filtered = alerts.filter(alert => alert.id !== id);
  saveAlerts(filtered);
};

// Check if an alert should be triggered based on current token data
export const checkAlertTrigger = (alert: Alert, currentValue: number): boolean => {
  switch (alert.comparison) {
    case '>':
      return currentValue > alert.threshold;
    case '<':
      return currentValue < alert.threshold;
    case '>=':
      return currentValue >= alert.threshold;
    case '<=':
      return currentValue <= alert.threshold;
    default:
      return false;
  }
};

// Get active alerts for a specific token
export const getActiveAlertsForToken = (tokenId: string): Alert[] => {
  return getAlerts().filter(
    alert => alert.tokenId === tokenId && alert.status === 'active'
  );
};

// Trigger an alert
export const triggerAlert = (alertId: string): void => {
  updateAlert(alertId, {
    status: 'triggered',
    triggeredAt: new Date(),
  });
};

// Get triggered alerts
export const getTriggeredAlerts = (): Alert[] => {
  return getAlerts().filter(alert => alert.status === 'triggered');
};

// Clear triggered alerts
export const clearTriggeredAlerts = (): void => {
  const alerts = getAlerts();
  const cleared: Alert[] = alerts.map(alert =>
    alert.status === 'triggered' ? { ...alert, status: 'inactive' as const } : alert
  );
  saveAlerts(cleared);
};
