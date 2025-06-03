# Goal
The goal is to enable a conversational AI assistant to gather scheduling information from a user, then coordinate with an automated browser agent to complete a booking on a website.

<span style="color:rgb(192, 0, 0)">Conversational Interaction</span>
>The AI Assistant should engage the Human user in a dialogue to collect all necessary booking details (e.g. name, email, date/time preferences, etc.).


<span style="color:rgb(255, 192, 0)">Browser Agent Booking</span> 
>Once the information is collected, the assistant will invoke a Browser Agent to navigate to the scheduling page and <mark style="background: #ADCCFFA6;">perform the booking automatically</mark> on behalf of the user.

# Tools
1. Nextjs (full-stack)
2. Playwright for controlling headless browsers.

# workflow
The chatbot UI code exists in the components folder, the idea is to have each component seperate and focus on it's role following the SOLID principles for seperation of concern.

- ConversationBot: is the main component that directs the flow of the conversation, where acts as the container that brings together the chat window for displaying messages and the input field for user responses.

- State Management Flow :
The core logic lives in the useConversation hook, which manages three key pieces of state: the conversation messages, the user's booking responses (name, date, time, email, comment, guests), and the current step in the conversation flow. When a user types something, it gets processed through processUserInput, which determines what happens next based on the current conversation step.

- Message Processing : 
When a user sends a message, the system first adds it to the message history, then checks what type of step they're currently on. If it's a regular input step (like asking for a name), the system validates the input if needed, stores it temporarily as "pending input," and shows a confirmation message. If it's a confirmation step, the system checks if the user said "yes" or "no" - if yes, it saves the pending input to the responses and moves forward; if no, it goes back to ask again.

- Booking Submission :
The most complex part happens at the end when all information is collected. After the user confirms their guest count (the final step), the system automatically submits all the collected responses to a booking API. While this happens in the background, it shows a processing message, then displays either a success or error result based on what the API returns.

# booking-bot:
The runBookingBot function launches a headless Chrome browser using Playwright and navigates to a specific Calendly booking page. It's wrapped in a retry mechanism that will attempt the booking process up to 3 times if something fails, which is smart since web scraping can be unreliable due to network issues or page loading problems.

# Certain Challenges
At the begining i didn't know where i should start, so my simple approach was is to get a simple conversation even if it was static, to just have an idea about how the work flow will be, due to the short of time. I think Builder Pattern wil be the best fit to expand this system, now i have this CONVERSATION_FLOW array, which it's static and hard to maintain in the long run but it's simple for small and quick solution appraoach. With Builder pattern i will get Dynamic Flow, i would just have methods and able to expand it further if i want to add different scrapping sites for data. And also good for Conditional Logic and Branching, Reusable Components and Easier Testing and Maintenance. 


----

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

