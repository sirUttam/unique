import React from 'react';

interface Props {
  onClose?: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

const ResumeWindow: React.FC<Props> = () => {
  return (
    <div>
      <h1>Resume</h1>
      <p>Resume content here...</p>
    </div>
  );
};

export default ResumeWindow;