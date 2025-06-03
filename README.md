# Goal  
The goal is to enable a conversational AI assistant to gather scheduling information from a user, then coordinate with an automated browser agent to complete a booking on a website.

<span style="color:rgb(192, 0, 0)">**Conversational Interaction**</span>  
> The AI Assistant should engage the human user in a dialogue to collect all necessary booking details (e.g., name, email, date/time preferences, etc.).

<span style="color:rgb(255, 192, 0)">**Browser Agent Booking**</span>  
> Once the information is collected, the assistant will invoke a browser agent to navigate to the scheduling page and <mark style="background: #ADCCFFA6;">perform the booking automatically</mark> on behalf of the user.

# Tools  
1. **Next.js (full-stack)**  
2. **Playwright** for controlling headless browsers  

## Why  
Using TypeScript and JavaScript was a great choice since they can run anywhere. I chose TypeScript because it provides compile-time checking and strong typing, ensuring I'm working with the right data throughout the process. Simplicity was my main goal initially, and Next.js was a solid choice for running both the back-end and front-end in one place.  

However, if I were to scale this system for a better architecture, I would use **Next.js for the front-end only**, since it’s built on top of React, makes front-end development faster, and supports SSR and SSG.

I chose **Playwright** because I had previous experience with it, and it’s simple and reliable for automating browser tasks.

# Workflow  

The chatbot UI code lives in the `components` folder. The idea is to have each component separated, focusing on its role, following the **SOLID principles** for separation of concerns.

- **ConversationBot**:  
  The main component that directs the flow of the conversation. It acts as a container that brings together the chat window for displaying messages and the input field for user responses.

- **State Management Flow**:  
  The core logic lives in the `useConversation` hook, which manages three key pieces of state:
  - The conversation messages  
  - The user's booking responses (name, date, time, email, comment, guests)  
  - The current step in the conversation flow  

  When a user types something, it gets processed through `processUserInput`, which determines what happens next based on the current conversation step.

- **Message Processing**:  
  When a user sends a message, the system adds it to the message history, then checks the type of step they’re on.  
  If it’s a regular input step (like asking for a name), it validates the input if needed, stores it temporarily as a *pending input*, and shows a confirmation message.  
  If it’s a confirmation step, it checks whether the user said "yes" or "no" — if yes, it saves the pending input to the responses and moves forward; if no, it goes back and asks again.

- **Booking Submission**:  
  The most complex part happens at the end when all information is collected. After the user confirms their guest count (the final step), the system automatically submits all the collected responses to a booking API.  
  While this happens in the background, it displays a processing message, then shows either a success or error message based on the API response.

# booking-bot  

The `runBookingBot` function launches a headless Chrome browser using Playwright and navigates to a specific Calendly booking page.  
It’s wrapped in a retry mechanism that attempts the booking process up to **three times** in case of failure — a smart move since web scraping can be unreliable due to network issues or page loading problems.

# Challenges  

At the beginning, I wasn’t sure where to start. So my simple approach was to build a static conversation flow just to understand how the workflow would behave — due to time constraints.

I believe the **Builder Pattern** would be a better fit for expanding this system. Right now, I have a static `CONVERSATION_FLOW` array, which is fine for a small, quick solution but hard to maintain long-term.

With a Builder Pattern, I could:
- Dynamically build conversation flows  
- Easily add different scraping sites for data  
- Handle conditional logic and branching cleanly  
- Create reusable components  
- Make testing and maintenance much easier  

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

