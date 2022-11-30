import * as React from 'react';

export interface TextFieldProps {
  labelClassName?: string;
  inputClassName?: string;
  divWrapperClassName?: string;
  placeholder: string;
  type: string;
  value?: string;
  label?: string;
  callback: (text: string) => void;
}

const TextField = ({
  placeholder,
  type,
  value,
  labelClassName,
  inputClassName,
  label,
  divWrapperClassName,
  callback
}: TextFieldProps) => {
  return (
    <>
      <li className='form-group w-100' style={{ listStyle: 'none' }}>
        <label className={labelClassName ?? ''}>{label ?? placeholder}</label>
        <div
          className={
            'd-flex swap-form-group swap-form-field ' + divWrapperClassName ??
            ''
          }
        >
          <input
            className={
              'form-control input-amount input-stake p-3 ' + inputClassName ??
              ''
            }
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(event) => callback(event.target.value)}
          />
        </div>
      </li>
    </>
  );
};

export default TextField;
