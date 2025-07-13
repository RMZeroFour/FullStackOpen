import { useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

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
        <Button color="inherit" onClick={toggleVisibility}>
          {buttonLabel}
        </Button>
      </div>
      <div style={{ display: visible ? '' : 'none' }}>
        {children}
        <Button color="inherit" onClick={toggleVisibility}>
          Close
        </Button>
      </div>
    </div>
  );
}

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};

export default Toggleable;