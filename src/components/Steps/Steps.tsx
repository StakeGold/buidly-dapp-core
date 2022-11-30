import React from 'react';

interface StepsProps {
  currentStep: number;
  steps: string[];
}

const Steps = ({ steps, currentStep }: StepsProps) => {
  const Step = ({
    index,
    step,
    state
  }: {
    index: number;
    step: string;
    state: 'completed' | 'active' | 'planned';
  }) => (
    <div key={index} className={`launchpad-step ${state}`}>
      <div className='step'>{step}</div>
    </div>
  );

  return (
    <div className='launchpad-steps'>
      {steps.map((step, index) => {
        let state: 'completed' | 'active' | 'planned' = 'planned';
        if (currentStep === index) {
          state = 'active';
        } else if (currentStep > index) {
          state = 'completed';
        }

        return <Step key={index} index={index + 1} step={step} state={state} />;
      })}
    </div>
  );
};

export default Steps;
