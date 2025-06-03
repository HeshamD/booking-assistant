// Date validation function for MM/DD/YYYY format
export const validateDate = (input: string): { isValid: boolean; errorMessage?: string } => {
  // Remove any extra whitespace
  const trimmedInput = input.trim();
  
  // Check if the input matches MM/DD/YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  
  if (!dateRegex.test(trimmedInput)) {
    return {
      isValid: false,
      errorMessage: "Please enter the date in MM/DD/YYYY format (e.g., 12/25/2024)"
    };
  }
  
  // Parse the date components
  const [month, day, year] = trimmedInput.split('/').map(Number);
  
  // Create a date object and validate it's a real date
  const date = new Date(year, month - 1, day);
  const isValidDate = date.getFullYear() === year && 
                     date.getMonth() === month - 1 && 
                     date.getDate() === day;
  
  if (!isValidDate) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid date (e.g., 12/25/2024)"
    };
  }
  
  // Check if the date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
  
  if (date < today) {
    return {
      isValid: false,
      errorMessage: "Please select a future date"
    };
  }
  
  return { isValid: true };
};

// Time validation function for HH:MM AM/PM format
export const validateTime = (input: string): { isValid: boolean; errorMessage?: string } => {
  // Remove any extra whitespace and convert to uppercase
  const trimmedInput = input.trim().toUpperCase();
  
  // Check if the input matches HH:MM AM/PM format
  const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/;
  
  if (!timeRegex.test(trimmedInput)) {
    return {
      isValid: false,
      errorMessage: "Please enter time in HH:MM AM/PM format (e.g., 02:30 PM or 10:15 AM)"
    };
  }
  
  // Parse the time components
  const match = trimmedInput.match(timeRegex);
  if (!match) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid time format"
    };
  }
  
  const [, hourStr, minuteStr, period] = match;
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  // Validate hour range (1-12)
  if (hour < 1 || hour > 12) {
    return {
      isValid: false,
      errorMessage: "Hour must be between 1 and 12"
    };
  }
  
  // Validate minute range (0-59)
  if (minute < 0 || minute > 59) {
    return {
      isValid: false,
      errorMessage: "Minutes must be between 00 and 59"
    };
  }
  
  // Validate AM/PM
  if (period !== 'AM' && period !== 'PM') {
    return {
      isValid: false,
      errorMessage: "Please specify AM or PM"
    };
  }
  
  return { isValid: true };
};

// Additional helper function to parse time for business logic if needed
export const parseTime = (timeString: string): { hour: number; minute: number; period: 'AM' | 'PM' } | null => {
  const trimmedInput = timeString.trim().toUpperCase();
  const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/;
  const match = trimmedInput.match(timeRegex);
  
  if (!match) return null;
  
  const [, hourStr, minuteStr, period] = match;
  return {
    hour: parseInt(hourStr, 10),
    minute: parseInt(minuteStr, 10),
    period: period as 'AM' | 'PM'
  };
};

// Additional helper function to parse date for business logic if needed
export const parseDate = (dateString: string): { month: number; day: number; year: number } | null => {
  const trimmedInput = dateString.trim();
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  
  if (!dateRegex.test(trimmedInput)) return null;
  
  const [month, day, year] = trimmedInput.split('/').map(Number);
  return { month, day, year };
};