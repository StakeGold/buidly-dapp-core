import React from 'react';

export interface ButtonProps {
  label: string;
}

const StakegoldButton = (props: ButtonProps) => {
  return <button>{props.label}</button>;
};

export default StakegoldButton;
