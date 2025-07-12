import React from 'react';

interface FormGroupProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  icon,
  className = '',
  children,
}) => {
  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <label className="block font-medium text-gray-700 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
};
