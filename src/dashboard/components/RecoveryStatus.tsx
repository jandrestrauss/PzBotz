import React from 'react';
import { useNotification } from '../../utils/NotificationManager';

interface RecoveryStatusProps {
  isRecovering: boolean;
  lastError?: string;
  recoveryAttempts: number;
}

export const RecoveryStatus: React.FC<RecoveryStatusProps> = ({
  isRecovering,
  lastError,
  recoveryAttempts
}) => {
  const { showNotification } = useNotification();

  React.useEffect(() => {
    if (isRecovering) {
      showNotification(`Recovery attempt ${recoveryAttempts} in progress...`, 'warning');
    }
  }, [isRecovering, recoveryAttempts, showNotification]);

  return (
    <div className="recovery-status">
      <h3>System Recovery Status</h3>
      <div className={`status-indicator ${isRecovering ? 'recovering' : 'stable'}`}>
        {isRecovering ? 'Recovery in Progress' : 'System Stable'}
      </div>
      {lastError && (
        <div className="last-error">
          <p>Last Error: {lastError}</p>
          <p>Recovery Attempts: {recoveryAttempts}</p>
        </div>
      )}
    </div>
  );
};
