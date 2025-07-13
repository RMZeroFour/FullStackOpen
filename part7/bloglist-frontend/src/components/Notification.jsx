import { useSelector } from 'react-redux';

function Notification() {
  const notification = useSelector(state => state.notification);

  return (
    <>
      {notification.message ? <div className='notification message'>{notification.message}</div> : null}
      {notification.error ? <div className='notification error'>{notification.error}</div> : null}
    </>
  );
}

export default Notification;
