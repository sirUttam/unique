import React from 'react';

interface Props {
  title: string;
  url: string;
  profileImage?: string;
  description: string;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
}

const BrowserWindow: React.FC<Props> = ({
  title,
  url,
  profileImage,
  description,
}) => {
  return (
    <div style={{ color: '#111' }}>
      {/* TOP BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
          background: '#eee',
          borderRadius: 8,
          marginBottom: 15,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'red' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'yellow' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'green' }} />
        </div>

        <div style={{ fontSize: 12, color: '#333' }}>{url}</div>
      </div>

      {/* CONTENT */}
      <h1>{title}</h1>

      {profileImage && (
        <img
          src={profileImage}
          alt="profile"
          style={{ width: 120, height: 120, borderRadius: '50%', marginTop: 15 }}
        />
      )}

      <p style={{ marginTop: 15 }}>{description}</p>

      <button style={{ marginTop: 15 }}>
        Visit Profile
      </button>
    </div>
  );
};

export default BrowserWindow;