import { useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

function Toggleable({ children, ref, buttonLabel }) {
  const [visible, setVisible] = useState(false);

  function toggleVisibility() {
    setVisible(!visible);
  }

  useImperativeHandle(ref, () => ({
    toggle: toggleVisibility
  }));

  return (
    <div>
      <div style={{ display: visible ? 'none' : '' }}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={{ display: visible ? '' : 'none' }}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
}

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};

export default Toggleable;