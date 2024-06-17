'use client';

import React from 'react';

function Handle({
  handle: { id, value, percent },
  getHandleProps
}) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#000000',
        border: '2px solid #FFCC00', 
        color: '#aaa',
      }}
      {...getHandleProps(id)}
    >
            <div style={{ display: 'none', textShadow: '2px 2px 8px rgba(0,0,0,0.95)', justifyContent: 'center', fontFamily: 'Roboto', fontSize: 11, marginTop: 30}} >
                {value}
            </div>
    </div>

  )
}

export default Handle;
