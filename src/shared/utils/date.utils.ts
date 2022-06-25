export const isWeekendDay = (date: string | Date) => {
  let dateInstance: Date;

  if (typeof date === 'string') {
    dateInstance = new Date(date);
  } else {
    dateInstance = date;
  }

  const dayOfWeek = dateInstance.getDay();

  return dayOfWeek === 0 || dayOfWeek === 6;
};

export const isToday = (date: string | Date) => {
  let dateInstance: Date;

  if (typeof date === 'string') {
    dateInstance = new Date(date);
  } else {
    dateInstance = date;
  }

  const today = new Date();

  return (
    dateInstance.getDate() == today.getDate() &&
    dateInstance.getMonth() == today.getMonth() &&
    dateInstance.getFullYear() == today.getFullYear()
  );
};
