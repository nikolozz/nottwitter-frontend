import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import { logoutModalStyles } from '../styles/logout-modal.styles';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../pages/Profile';

function Logout() {
  const history = useHistory();
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  const { loading, error, data } = useQuery(ME_QUERY);

  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleLogout = async () => {
    localStorage.removeItem('Authentication');
    history.push('login');
  };

  return (
    <div className="logout">
      <span onClick={() => setmodalIsOpen(true)} style={{ flex: 1, flexDirection: 'row' }}>
        <h4>
          <img
            src={data.me.Profile?.avatar}
            style={{ width: '40px', borderRadius: '50%' }}
            alt="avatar"
          />
          <span style={{ marginLeft: '10px', marginTop: '-10px' }}>{data.me.username}</span>
          <span style={{ marginLeft: '30px' }}>
            <i className="fas fa-ellipsis-h"></i>
          </span>
        </h4>
      </span>
      <div style={{ position: 'absolute', bottom: 0 }}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setmodalIsOpen(false)}
          contentLabel="Modal"
          style={logoutModalStyles}
        >
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <p style={{ borderBottom: '1px solid black' }}>Log out @{data.me.username}</p>
          </span>
        </Modal>
      </div>
    </div>
  );
}

export default Logout;
