import React, { useState } from 'react';
import SketchPicker from 'react-color/lib/components/sketch/Sketch';

// const {SketchPicker} = ReactPicker

function ColorPicker() {
  const [color, setColor] = useState('#ffffff'); // Initial color

  const handleChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div>
      <h2>Color Picker</h2>
      <SketchPicker color={color} onChange={handleChange} />
      <p>You picked: {color}</p>
    </div>
  );
}

export default ColorPicker;
