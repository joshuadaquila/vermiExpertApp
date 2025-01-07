/**
 * Formats a datetime value to the desired format: "YYYY-MM-DD hh:mm A"
 * @param {string} dateTimeString - The datetime string or ISO string to format
 * @returns {string} - Formatted datetime string
 */
export const formatDateTime = (dateTimeString) => {
  try {
    const date = new Date(dateTimeString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12; // Converts `0` hour to `12`
    const formattedHours = String(hours).padStart(2, '0');

    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return dateTimeString; // Fallback to input string if there's an issue
  }
};
