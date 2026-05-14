import React from 'react';

interface Props {
  onClose?: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

const AboutWindow: React.FC<Props> = () => {
  return (
    <div>
      <h1>About</h1>
      <p>About content here...</p>
    </div>
  );
};

export default AboutWindow;