'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Trash2, AlertTriangle } from 'lucide-react';
import { Alert } from '../../types';
import { getAlerts, deleteAlert, getTriggeredAlerts, clearTriggeredAlerts } from '../../utils/alerts';
import { cn } from '../../utils/cn';

interface AlertListProps {
  tokenId?: string; // Optional: show alerts for specific token only
}

export const AlertList: React.FC<AlertListProps> = ({ tokenId }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadAlerts();
  }, [tokenId]);

  const loadAlerts = () => {
    const allAlerts = getAlerts();
    const triggered = getTriggeredAlerts();

    if (tokenId) {
      setAlerts(allAlerts.filter(alert => alert.tokenId === tokenId));
      setTriggeredAlerts(triggered.filter(alert => alert.tokenId === tokenId));
    } else {
      setAlerts(allAlerts);
      setTriggeredAlerts(triggered);
    }
  };

  const handleDeleteAlert = (alertId: string) => {
    deleteAlert(alertId);
    loadAlerts();
  };

  const handleClearTriggered = () => {
    clearTriggeredAlerts();
    setTriggeredAlerts([]);
  };

  const formatThreshold = (alert: Alert) => {
    if (alert.alertType === 'price') {
      return `$${alert.threshold.toFixed(6)}`;
    }
    return alert.threshold.toLocaleString();
  };

  const getAlertTypeLabel = (type: string) => {
    return type === 'price' ? 'Price' : 'Volume';
  };

  return (
    <div className="space-y-4">
      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-medium text-text-primary">Triggered Alerts</h3>
            </div>
            <button
              onClick={handleClearTriggered}
              className="text-sm text-warning hover:text-orange-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {triggeredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-warning/5 rounded border border-warning/10"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-warning" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {getAlertTypeLabel(alert.alertType)} {alert.comparison} {formatThreshold(alert)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Triggered {alert.triggeredAt?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-1 hover:bg-warning/20 rounded"
                >
                  <Trash2 className="w-4 h-4 text-warning" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Active Alerts</h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-surface border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium text-text-primary">
                      {getAlertTypeLabel(alert.alertType)} {alert.comparison} {formatThreshold(alert)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Created {alert.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-2 hover:bg-red-50 rounded text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {alerts.length === 0 && triggeredAlerts.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">No alerts set up yet</p>
          <p className="text-sm text-text-secondary mt-1">
            Create alerts to get notified about price movements
          </p>
        </div>
      )}
    </div>
  );
};

