"use client";

import { useState } from "react";

const Button = (props: {
  disabled?: boolean;
  title: string;
  onClick: () => void;
  additionalStyle?: React.CSSProperties;
}) => {
  const { disabled, title, onClick, additionalStyle } = props;

  const [hover, setHover] = useState(false);

  const doNothing = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={disabled ? doNothing : onClick}
      className="bg-black text-white p-4 rounded-lg"
      style={{
        // color: color[type],
        ...(additionalStyle || {}),
      }}
    >
      <div className="fs-16">{title}</div>
    </button>
  );
};

export default Button;
