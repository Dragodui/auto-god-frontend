import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MenuItem {
  label: string;
  href: string;
}

interface FallingMenuProps {
  label: string;
  items: MenuItem[];
}

export function FallingMenu({ label, items }: FallingMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-[100]" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 rounded-lg bg-bg px-4 py-2 text-sm font-medium text-text shadow-sm transition-all focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute left-0 z-10 mt-2 min-w-[180px] origin-top-left rounded-lg bg-bg p-1 shadow-lg ring-1 ring-black/5 transition-all ${
          isOpen
            ? 'visible scale-100 opacity-100'
            : 'invisible scale-95 opacity-0'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block rounded-md px-4 py-2 text-sm text-text transition-colors font-medium hover:text-secondary"
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
