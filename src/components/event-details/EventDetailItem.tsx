import { LucideIcon } from 'lucide-react';

interface EventDetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  className?: string;
}

export default function EventDetailItem({
  icon: Icon,
  label,
  value,
  subValue,
  className = '',
}: EventDetailItemProps) {
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className="flex items-center gap-2 text-primary mb-1.5">
        <Icon size={16} strokeWidth={2.5} />
        <span className="text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>
      <div>
        <p className="text-foreground font-semibold text-sm">
          {value}
        </p>
        {subValue && (
          <p className="text-default-500 text-xs mt-0.5">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}