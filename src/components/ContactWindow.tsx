import React from 'react';

interface Props {
  onClose?: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

const ContactWindow: React.FC<Props> = () => {
  return (
    <div>
      <h1>Contact</h1>
      <p>Contact form here...</p>
    </div>
  );
};

export default ContactWindow;