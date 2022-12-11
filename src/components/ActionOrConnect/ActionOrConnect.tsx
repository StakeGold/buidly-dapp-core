import React, { ReactNode, useState } from 'react';
import { useGetAccount } from '@elrondnetwork/dapp-core/hooks';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConnectModal from './ConnectModal';

interface ActionOrConnectProps {
  children: ReactNode;
  className?: string;
}

const ActionOrConnect = ({ children, className }: ActionOrConnectProps) => {
  const { address } = useGetAccount();
  const isLoggedIn = Boolean(address);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = (event: React.MouseEvent<HTMLElement>) => {
    setShowModal(true);
    event.stopPropagation();
  };
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      {isLoggedIn ? (
        <>{children}</>
      ) : (
        <a
          className={`btn btn-primary ${className}`}
          onClick={(event) => handleShowModal(event)}
        >
          <FontAwesomeIcon icon={faLink} className='mr-2' />
          Connect
        </a>
      )}

      <ConnectModal show={showModal} onHide={handleCloseModal} />
    </>
  );
};

export default ActionOrConnect;
