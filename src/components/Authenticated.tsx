import React from 'react';
import { Redirect } from 'react-router-dom';

function Authenticated({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('Authentication');
  if (!token) {
    return <Redirect to={{ pathname: '/login' }} />;
  }
  return <>{children}</>;
}

export default Authenticated;
