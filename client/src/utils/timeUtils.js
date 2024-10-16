  // Format the date/time string to "yyyy/MM/dd (HH:mm)"
  export const formatDateTime = (date) => {
    const newDate = new Date(date).toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const newTime = new Date(date).toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      hour12: false,
      minute: '2-digit',
      hour: '2-digit',
    });

    return `${newDate} (${newTime})`;
  };
