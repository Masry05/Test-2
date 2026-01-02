import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: number | string;
    onChange: (value: string) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, className, ...props }) => {
    const handleIncrement = () => {
        const currentVal = Number(value) || 0;
        onChange(String(currentVal + 1));
    };

    const handleDecrement = () => {
        const currentVal = Number(value) || 0;
        onChange(String(currentVal - 1));
    };

    return (
        <div className={`relative flex items-center ${className || ''}`}>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md font-mono text-center focus:ring-2 focus:ring-blue-500 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${className}`}
                {...props}
            />
            <div className="absolute right-1 top-1 bottom-1 flex flex-col justify-center gap-0.5">
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="p-0.5 text-gray-400 hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                    <ChevronUp size={12} strokeWidth={3} />
                </button>
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="p-0.5 text-gray-400 hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                    <ChevronDown size={12} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};

export default NumberInput;
