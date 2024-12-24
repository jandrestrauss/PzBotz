import React, { createContext, useContext, useState } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

const NotificationContext = createContext<{
  showNotification: (message: string, type: Notification['type']) => void;
}>({ showNotification: () => {} });

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: Notification['type']) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
