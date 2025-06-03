import { chromium } from "playwright";
import retry from "async-retry";
import { UserResponses } from "../types/conversation";
import { parse } from "date-fns";

interface CalendarDay {
  day: number;
  month: string;
  year: number;
  isAvailable: boolean;
  isToday: boolean;
  isSelected: boolean;
  fullLabel: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendarData {
  currentMonth: string;
  currentYear: number;
  availableDays: CalendarDay[];
  selectedDate?: string;
  availableTimeSlots: TimeSlot[];
}

export async function runBookingBot(data: UserResponses): Promise<void> {
  await retry(
    async () => {
      console.log("🚀 Launching browser...");
      const browser = await chromium.launch({
        headless: true,
      });
      const context = await browser.newContext();
      const page = await context.newPage();

      console.log("🌐 Navigating to Calendly page...");
      
      try {
        await page.goto("https://calendly.com/aadhrik-myaifrontdesk/30min", {
          timeout: 2 * 60 * 1000,
          waitUntil: "networkidle",
        });
        console.log("✅ Page loaded successfully.");

        // Wait for calendar to load
        await page.waitForSelector('[data-testid="calendar"]');
        await page.waitForSelector('[data-testid="calendar-table"]');

        // Extract all calendar data
        const calendarData = await extractCalendarData(page);
        console.log("📊 Calendar data extracted:", JSON.stringify(calendarData, null, 2));

        // Parse the user's desired date
        const userDate = parse(data.date, "MM/dd/yyyy", new Date());
        const desiredDay = userDate.getDate();
        const desiredMonth = userDate.toLocaleString("default", { month: "long" });
        const desiredYear = userDate.getFullYear();

        console.log(`🎯 Looking for: ${desiredMonth} ${desiredDay}, ${desiredYear}`);

        // Navigate to the correct month if needed
        await navigateToMonth(page, desiredMonth, desiredYear);

        // Refresh calendar data after navigation
        const updatedCalendarData = await extractCalendarData(page);
        
        // Find and click the desired date
        const targetDate = updatedCalendarData.availableDays.find(
          day => day.day === desiredDay && 
                 day.month === desiredMonth && 
                 day.year === desiredYear && 
                 day.isAvailable
        );

        if (targetDate) {
          console.log(`✅ Found target date: ${targetDate.fullLabel}`);
          
          // Click on the date
          await page.click(`button[aria-label="${targetDate.fullLabel}"]`);
          
          // Wait for time slots to load
          await page.waitForSelector('[data-component="spotpicker-times"]', { timeout: 10000 });
          
          // Extract available time slots
          const timeSlots = await extractTimeSlots(page);
          console.log("⏰ Available time slots:", timeSlots);

          // Select the preferred time if specified
          if (data.time && timeSlots.length > 0) {
            const preferredTime = findBestTimeMatch(data.time, timeSlots);
            if (preferredTime) {
              console.log(`🕐 Selecting time: ${preferredTime.time}`);
              await page.click(`button[data-start-time="${preferredTime.time}"]`);
              
              // Wait a moment for the selection to process
              await page.waitForTimeout(2000);
              
              console.log("✅ Time slot selected successfully!");

              // Now click the "Next" button to proceed to the details form
              console.log("🔄 Clicking Next button...");
              await page.waitForSelector('button[aria-label*="Next"]', { timeout: 10000 });
              await page.click('button[aria-label*="Next"]');
              
              // Wait for the form page to load
              await page.waitForSelector('h2:has-text("Enter Details")', { timeout: 10000 });
              console.log("📝 Details form loaded, filling out information...");
              
              // Fill out the form
              await fillBookingForm(page, data);
              
            } else {
              console.log("⚠️ Preferred time not available, available times:", 
                timeSlots.map(slot => slot.time).join(", "));
            }
          }

        } else {
          console.log("❌ Desired date not available or not found.");
          console.log("Available dates:", updatedCalendarData.availableDays
            .filter(day => day.isAvailable)
            .map(day => `${day.month} ${day.day}, ${day.year}`)
            .join(", "));
        }

      } catch (error) {
        console.error("❌ Error during booking process:", error);
        await page.screenshot({ path: "booking-error.png", fullPage: true });
        throw error;
      } finally {
        await browser.close();
        console.log("🛑 Browser closed.");
      }
    },
    {
      retries: 3,
      onRetry: (err, attempt) => {
        console.error(`Attempt ${attempt} failed. Retrying...`, err);
      },
    }
  );
  console.log("✅ Bot run completed.");
}

async function fillBookingForm(page: any, data: UserResponses): Promise<void> {
  try {
    // Fill in the name field
    if (data.name) {
      console.log(`📝 Filling name: ${data.name}`);
      await page.fill('input[name="full_name"]', data.name);
    }

    // Fill in the email field
    if (data.email) {
      console.log(`📧 Filling email: ${data.email}`);
      await page.fill('input[name="email"]', data.email);
    }

    // Fill in the additional information textarea if provided
    if (data.comment) {
      console.log("📄 Adding additional information...");
      await page.fill('textarea[name="question_0"]', data.comment);
    }

    // Wait a moment before submitting
    await page.waitForTimeout(1000);

    // Click the "Schedule Event" button to submit the form
    console.log("🎯 Submitting the booking form...");
    await page.click('button[type="submit"]:has-text("Schedule Event")');
    
    // Wait for confirmation or next page
    await page.waitForTimeout(3000);
    console.log("✅ Booking form submitted successfully!");

  } catch (error) {
    console.error("❌ Error filling booking form:", error);
    throw error;
  }
}

async function extractCalendarData(page: any): Promise<CalendarData> {
  return await page.evaluate(() => {
    const calendarData: CalendarData = {
      currentMonth: "",
      currentYear: 0,
      availableDays: [],
      availableTimeSlots: []
    };

    // Get current month/year from header
    const titleElement = document.querySelector('[data-testid="title"]');
    if (titleElement?.textContent) {
      const [month, year] = titleElement.textContent.split(' ');
      calendarData.currentMonth = month;
      calendarData.currentYear = parseInt(year);
    }

    // Extract all calendar day buttons
    const dayButtons = document.querySelectorAll('[data-testid="calendar-table"] button[aria-label]');
    
    dayButtons.forEach((button) => {
      const htmlButton = button as HTMLButtonElement;
      const ariaLabel = htmlButton.getAttribute('aria-label') || '';
      const dayText = htmlButton.querySelector('span')?.textContent || '';
      
      // Parse the aria-label to extract date info
      // Format: "Tuesday, June 3 - Times available" or "Sunday, June 1 - No times available"
      const labelMatch = ariaLabel.match(/(\w+), (\w+) (\d+) - (.*)/);
      
      if (labelMatch) {
        const [, dayOfWeek, month, day, availability] = labelMatch;
        const isAvailable = availability.includes('Times available');
        const isToday = htmlButton.hasAttribute('aria-current');
        const isSelected = htmlButton.getAttribute('aria-selected') === 'true';
        
        // Determine year - if month comes before current month, it's next year
        const currentMonth = calendarData.currentMonth;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonthIndex = monthNames.indexOf(currentMonth);
        const dayMonthIndex = monthNames.indexOf(month);
        
        let year = calendarData.currentYear;
        if (dayMonthIndex < currentMonthIndex) {
          year = calendarData.currentYear + 1;
        }

        calendarData.availableDays.push({
          day: parseInt(day),
          month: month,
          year: year,
          isAvailable: isAvailable,
          isToday: isToday,
          isSelected: isSelected,
          fullLabel: ariaLabel
        });
      }
    });

    return calendarData;
  });
}

async function extractTimeSlots(page: any): Promise<TimeSlot[]> {
  return await page.evaluate(() => {
    const timeSlots: TimeSlot[] = [];
    
    // Look for time slot buttons
    const timeButtons = document.querySelectorAll('[data-container="time-button"]');
    
    timeButtons.forEach((button) => {
      const htmlButton = button as HTMLButtonElement;
      const startTime = htmlButton.getAttribute('data-start-time') || '';
      const timeText = htmlButton.querySelector('[class*="vXODG3JdP3dNSMN_2yKi"]')?.textContent || startTime;
      
      timeSlots.push({
        time: startTime || timeText,
        available: !htmlButton.disabled
      });
    });

    return timeSlots;
  });
}

async function navigateToMonth(page: any, targetMonth: string, targetYear: number): Promise<void> {
  let attempts = 0;
  const maxAttempts = 12; // Prevent infinite loops

  while (attempts < maxAttempts) {
    // Get current displayed month/year
    const currentTitle = await page.$eval('[data-testid="title"]', (el: Element) => el.textContent);
    const [currentMonth, currentYearStr] = currentTitle.split(' ');
    const currentYear = parseInt(currentYearStr);

    console.log(`📅 Current: ${currentMonth} ${currentYear}, Target: ${targetMonth} ${targetYear}`);

    if (currentMonth === targetMonth && currentYear === targetYear) {
      console.log("✅ Reached target month/year");
      break;
    }

    // Determine if we need to go forward or backward
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentMonthIndex = monthNames.indexOf(currentMonth);
    const targetMonthIndex = monthNames.indexOf(targetMonth);
    
    const currentDate = new Date(currentYear, currentMonthIndex);
    const targetDate = new Date(targetYear, targetMonthIndex);

    if (targetDate > currentDate) {
      // Go forward
      const nextButton = await page.$('button[aria-label="Go to next month"]:not([disabled])');
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(1000); // Wait for calendar to update
      } else {
        console.log("⚠️ Cannot navigate forward - next button disabled");
        break;
      }
    } else if (targetDate < currentDate) {
      // Go backward  
      const prevButton = await page.$('button[aria-label="Go to previous month"]:not([disabled])');
      if (prevButton) {
        await prevButton.click();
        await page.waitForTimeout(1000); // Wait for calendar to update
      } else {
        console.log("⚠️ Cannot navigate backward - previous button disabled");
        break;
      }
    }

    attempts++;
  }

  if (attempts >= maxAttempts) {
    console.log("⚠️ Max navigation attempts reached");
  }
}

function findBestTimeMatch(preferredTime: string, availableSlots: TimeSlot[]): TimeSlot | null {
  // First try exact match
  const exactMatch = availableSlots.find(slot => 
    slot.time.toLowerCase() === preferredTime.toLowerCase() && slot.available
  );
  
  if (exactMatch) return exactMatch;

  // Try partial matches
  const partialMatch = availableSlots.find(slot => 
    slot.time.toLowerCase().includes(preferredTime.toLowerCase()) && slot.available
  );
  
  if (partialMatch) return partialMatch;

  // Return first available slot if no match
  return availableSlots.find(slot => slot.available) || null;
}