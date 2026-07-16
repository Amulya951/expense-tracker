import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Calculator({ onApply, onClose }) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleNumber = (num) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const exp = expression + display;
      const result = new Function('return ' + exp)();
      const rounded = Math.round(result * 100) / 100;
      setDisplay(String(rounded));
      setExpression('');
    } catch (e) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleApply = () => {
    let finalValue = display;
    if (expression && display !== 'Error') {
      try {
        const result = new Function('return ' + expression + display)();
        finalValue = String(Math.round(result * 100) / 100);
      } catch (e) {
        finalValue = '0';
      }
    }
    
    if (finalValue !== 'Error' && !isNaN(Number(finalValue))) {
      onApply(finalValue);
      onClose();
    }
  };

  return (
    <div className="calculator-inline">
      <div className="calculator-header">
        <h3>Calculator</h3>
        <button type="button" onClick={onClose} className="calculator-close" title="Close">
          <FaTimes />
        </button>
      </div>

      <div className="calculator-display">
        <div className="calculator-expression">{expression}</div>
        <div className="calculator-value">{display}</div>
      </div>

      <div className="calculator-grid">
        <button type="button" onClick={handleClear} className="calculator-btn btn-clear">C</button>
        <button type="button" onClick={() => handleOperator('/')} className="calculator-btn btn-op">÷</button>
        <button type="button" onClick={() => handleOperator('*')} className="calculator-btn btn-op">×</button>
        <button type="button" onClick={() => handleOperator('-')} className="calculator-btn btn-op">−</button>

        <button type="button" onClick={() => handleNumber('7')} className="calculator-btn btn-num">7</button>
        <button type="button" onClick={() => handleNumber('8')} className="calculator-btn btn-num">8</button>
        <button type="button" onClick={() => handleNumber('9')} className="calculator-btn btn-num">9</button>
        <button type="button" onClick={() => handleOperator('+')} className="calculator-btn btn-op">+</button>

        <button type="button" onClick={() => handleNumber('4')} className="calculator-btn btn-num">4</button>
        <button type="button" onClick={() => handleNumber('5')} className="calculator-btn btn-num">5</button>
        <button type="button" onClick={() => handleNumber('6')} className="calculator-btn btn-num">6</button>
        <button type="button" onClick={calculate} className="calculator-btn btn-equals">=</button>

        <button type="button" onClick={() => handleNumber('1')} className="calculator-btn btn-num">1</button>
        <button type="button" onClick={() => handleNumber('2')} className="calculator-btn btn-num">2</button>
        <button type="button" onClick={() => handleNumber('3')} className="calculator-btn btn-num">3</button>

        <button type="button" onClick={() => handleNumber('0')} className="calculator-btn btn-num span-2">0</button>
        <button type="button" onClick={() => handleNumber('.')} className="calculator-btn btn-num">.</button>
        <button type="button" onClick={handleApply} className="calculator-btn btn-apply">Apply</button>
      </div>
    </div>
  );
}

