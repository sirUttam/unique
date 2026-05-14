import React from 'react';

interface Props {
  onClose?: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

const SkillsWindow: React.FC<Props> = () => {
  return (
    <div>
      <h1>Skills</h1>
      <p>Skills content here...</p>
    </div>
  );
};

export default SkillsWindow;