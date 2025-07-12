import { createContext, useContext, useReducer } from "react";

function notificationReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.payload.message;
    case 'RESET':
      return null;
    default:
      return state;
  }
}

const NotificationContext = createContext(null);

function NotificationContextProvider({ children }) {
  const [notification, notificationDispatch] = useReducer(notificationReducer);
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

function useNotificationMessage() {
  const [notification, _] = useContext(NotificationContext);
  return notification;
}

function useNotificationDispatch() {
  const [_, notificationDispatch] = useContext(NotificationContext);
  return notificationDispatch;
}

export default NotificationContext;
export { NotificationContextProvider, useNotificationMessage, useNotificationDispatch };