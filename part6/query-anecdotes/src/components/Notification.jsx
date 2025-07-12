import { useNotificationMessage } from "./NotificationContext";

function Notification() {
  const notification = useNotificationMessage();

  if (!notification) {
    return null;
  }

  return (
    <div style={{ border: 'solid', padding: 10, borderWidth: 1, marginBottom: 5 }}>
      {notification}
    </div>
  );
}

export default Notification;
