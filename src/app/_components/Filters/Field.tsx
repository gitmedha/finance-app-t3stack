interface FieldProps {
    label: string;
    children: React.ReactNode;
    className?: string;
  }
  
  const Field = ({ label, children, className }: FieldProps) => {
    return (
      <div className={`w-full mb-4 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
      </div>
    );
  };
  
  export default Field;
  