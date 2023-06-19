import { useEffect, useRef, useState } from 'react';
import './style/index.less';

export type PinCodeProps = {
  length: number;
  value?: string;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  onFocus?: () => void;
  pattern?: RegExp;
  disabled?: boolean;
};

const PinCode: React.FC<PinCodeProps> = props => {
  const initArray = new Array(props.length).fill('');
  const [codeArray, setCodeArray] = useState(props.value !== undefined ? initArray.map((o, i) => props.value?.slice()[i] ?? '') : initArray);
  const [value, setValue] = useState(props.value);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChange = (e: any) => {
    console.log('value', e.target.value);
    console.log('e.target.value.replace(props.pattern', e.target.value.replace(props.pattern, ''));
    const patternValue = props.pattern ? e.target.value.replace(props.pattern, '') : e.target.value;
    console.log('patternValue', patternValue);
    const array = patternValue.slice();
    setValue(patternValue);
    const newArray = codeArray.map((o, i) => array[i] || '');
    console.log('newArray', newArray);
    console.log('patternValue11', patternValue);
    setCodeArray(newArray);
    props.onChange && props.onChange(patternValue);
  };

  console.log('codeArray', codeArray);
  console.log('value====', value);
  return (
    <div className="me-pin-code">
      <div className="me-pin-code-wrapper">
        <input
          ref={inputRef}
          className="me-pin-code-input"
          disabled={props.disabled}
          onFocus={() => {
            setFocus(true);
            inputRef.current?.setSelectionRange(100, 100);
            props.onFocus && props.onFocus();
          }}
          value={value}
          onBlur={() => {
            setFocus(false);
            props.onBlur && props.onBlur(codeArray.join(''));
          }}
          //@ts-ignore
          pattern={/[^0-9]/}
          onChange={onChange}
          type="tel"
          maxLength={props.length}
        />
        {codeArray.map((code, index) => (
          <div
            key={index}
            className={`me-pin-code-item ${
              (codeArray.findIndex(o => o === '') === index && focus) ||
              (codeArray.findIndex(o => o === '') < 0 && index === codeArray.length - 1 && focus)
                ? 'focus'
                : ''
            }`}
          >
            {code}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinCode;
