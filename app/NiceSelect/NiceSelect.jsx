import React from 'react';
import { bindNiceSelect } from './NiceSelectUtil';
import './NiceSelect.css';

export default function NiceSelect({ id, children, ...otherProps }) {
  React.useEffect(() => {
    const el = document.getElementById(id);
    const alreadyLoaded = document.querySelector(`[data-id="${id}-nice"]`);
    // console.log(el.children[0].value);
    if (!alreadyLoaded) {
      bindNiceSelect(el);
    }
  }, []);

  return (
    <select id={id} {...otherProps}>
      {children}
    </select>
  );
}