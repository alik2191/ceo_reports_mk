import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Network,
  Users,
  Settings,
  Calculator,
  TrendingUp,
  ShieldAlert,
  Target,
  FileBarChart,
  BookOpen,
  LucideProps,
} from 'lucide-react';

interface NavIconProps extends LucideProps {
  name: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Network':
      return <Network {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'Settings':
      return <Settings {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Target':
      return <Target {...props} />;
    case 'FileBarChart':
      return <FileBarChart {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    default:
      return <LayoutDashboard {...props} />;
  }
};
