# Real-Time Chat App

A real-time chat application built with **React** and **Firebase**. Authenticated users can browse users, start or continue chats, send text messages, share images, and use emojis—all with live updates.

## Features

- **Authentication** — Sign up and log in with email and password (Firebase Auth).
- **Real-time messaging** — Send and receive messages instantly via Firestore listeners.
- **Image sharing** — Attach and upload images to Firebase Storage; share image URLs in chat.
- **Emoji picker** — Insert emojis into messages with a click-outside-to-close picker.
- **Users & chats** — Sidebar with tabs: browse all users or your existing chatrooms.
- **Chat list** — See last message and timestamp per chat; click to open a conversation.
- **Responsive UI** — Tailwind CSS and DaisyUI for layout and components.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — dev server and build
- **React Router 7** — routing (public: login/register; private: home, chat)
- **Firebase** — Auth, Firestore, Storage
- **Tailwind CSS 4** + **DaisyUI**
- **React Hook Form** + **Zod** — forms and validation
- **Zustand** — client state (e.g. active tab)
- **Sonner** — toasts
- **Day.js** — message timestamps
- **emoji-picker-react** — emoji picker

## Prerequisites

- **Node.js** 18+
- **npm** (or pnpm / yarn)
- A **Firebase** project with Auth, Firestore, and Storage enabled

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/kirilldevm/nextjs-firebase-chat-app
cd react-firebase-realtime-chat-app
npm install
```

### 2. Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password sign-in).
3. Create a **Firestore** database.
4. Create a **Storage** bucket.
5. Register a web app and copy the config object.

### 3. Configure Firebase

Put your Firebase config in [`src/lib/fitebase.ts`](src/lib/fitebase.ts) (replace the existing `firebaseConfig`):

```ts
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: '...',
  appId: '...',
};
```

For production, use environment variables and avoid committing secrets.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Sign up, log in, then use the sidebar to switch between **Users** and **Chats** and open a conversation.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | TypeScript check + build |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Project Structure

```
src/
├── components/     # UI (sidebar, chats, users, message-input, message-card, …)
├── hooks/          # useAuth, useSendMessage, useGetMessagesByChatroomId, …
├── layouts/        # PrivateLayout (auth required), PublicLayout (login/register)
├── lib/            # Firebase init (fitebase.ts)
├── pages/          # login, register, main-chat
├── schemas/        # Zod schemas (e.g. auth)
├── store/          # Zustand store
├── types/          # TypeScript types (user, message, chatroom)
├── App.tsx
├── main.tsx        # Router + lazy-loaded pages
└── index.css       # Tailwind + global styles
```

## Firestore / Storage usage

- **Firestore**: `chatrooms/{id}` (metadata, `users`, `usersData`, `lastMessage`), `chatrooms/{id}/messages` (message docs).
- **Storage**: `chatroom_images/` for uploaded images; image URLs are stored in message `image` and in `lastMessage` when applicable.
