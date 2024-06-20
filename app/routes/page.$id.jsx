import React, { useEffect } from 'react';

const MyComponent = () => {
    useEffect(() => {
    console.log('dsd');
    return () => true;
  }, []);

  return (
    <div>
      <h1>Hello, React!</h1>
      {/* Your component JSX */}
    </div>
  );
};

export default MyComponent;
