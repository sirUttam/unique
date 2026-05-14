import React from 'react';

interface Props {
  onClose?: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

const ProjectsWindow: React.FC<Props> = () => {
  return (
    <div>
      <h1>Projects</h1>
      <p>Project content here...</p>
    </div>
  );
};

export default ProjectsWindow;