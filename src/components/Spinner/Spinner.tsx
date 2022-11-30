import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Spinner = () => (
  <div className='spinner'>
    <FontAwesomeIcon icon={faSpinner} className='icon mb-2' size='2x' />
  </div>
);

export default Spinner;
