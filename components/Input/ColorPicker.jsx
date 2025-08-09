import { useState } from "react";

export default function ColorPicker({ value, onChange, size }) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: size, height: size, borderRadius: "5px" }}
    />
  );
}
