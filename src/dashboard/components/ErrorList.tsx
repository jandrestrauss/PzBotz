import React from 'react';
import { useNotification } from '../../utils/NotificationManager';

interface ErrorListProps {
  errors: Array<{
    id: string;
    message: string;
    timestamp: number;
    resolved?: boolean;
  }>;
}

const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
  const { showNotification } = useNotification();

  const handleResolve = (id: string) => {
    // Implement error resolution logic
    showNotification('Error marked as resolved', 'success');
  };

  return (
    <div className="error-list">
      <h3>Recent Errors</h3>
      {errors.length === 0 ? (
        <p>No errors to display</p>
      ) : (
        <ul>
          {errors.map(error => (
            <li key={error.id} className={error.resolved ? 'resolved' : ''}>
              <span className="timestamp">
                {new Date(error.timestamp).toLocaleTimeString()}
              </span>
              <span className="message">{error.message}</span>
              {!error.resolved && (
                <button onClick={() => handleResolve(error.id)}>
                  Mark Resolved
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ErrorList;
