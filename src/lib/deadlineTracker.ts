export interface DeadlineStatus {
  daysLeft: number;
  label: string;
  isExpired: boolean;
  urgency: 'high' | 'medium' | 'low' | 'none';
  badgeColor: string;
  textColor: string;
}

export const getDeadlineStatus = (deadlineDateString: string): DeadlineStatus => {
  if (!deadlineDateString) {
    return {
      daysLeft: 999,
      label: 'Open Application',
      isExpired: false,
      urgency: 'low',
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
      textColor: 'text-gray-600'
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(deadlineDateString);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      daysLeft,
      label: `Closed on ${targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      isExpired: true,
      urgency: 'none',
      badgeColor: 'bg-gray-100 text-gray-500 border-gray-200',
      textColor: 'text-gray-400'
    };
  }

  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      label: 'Due Today',
      isExpired: false,
      urgency: 'high',
      badgeColor: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
      textColor: 'text-red-700 font-semibold'
    };
  }

  if (daysLeft === 1) {
    return {
      daysLeft: 1,
      label: 'Due Tomorrow',
      isExpired: false,
      urgency: 'high',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      textColor: 'text-red-700 font-semibold'
    };
  }

  if (daysLeft <= 7) {
    return {
      daysLeft,
      label: `Closing in ${daysLeft} days`,
      isExpired: false,
      urgency: 'high',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      textColor: 'text-rose-700'
    };
  }

  if (daysLeft <= 30) {
    return {
      daysLeft,
      label: `Due in ${daysLeft} days`,
      isExpired: false,
      urgency: 'medium',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      textColor: 'text-amber-800'
    };
  }

  return {
    daysLeft,
    label: `${daysLeft} days remaining`,
    isExpired: false,
    urgency: 'low',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-700'
  };
};

export const formatCurrencyINR = (amount?: number): string => {
  if (!amount) return 'Variable / Need-based';
  return `₹${amount.toLocaleString('en-IN')}`;
};
