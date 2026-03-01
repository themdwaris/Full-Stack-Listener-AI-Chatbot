# 🤖 Listener — AI Chatbot

A modern, full-stack AI chatbot application built with **Next.js**, **Tailwind CSS**, **MongoDB**, and **OpenRouter API**. Listener provides a seamless conversational experience with real-time streaming responses, persistent chat history, and secure JWT-based authentication.

---

## ✨ Features

### 🤖 AI Conversation
- Real-time **streaming responses** — tokens appear word by word like ChatGPT
- Powered by **Meta LLaMA 3 (8B)** via OpenRouter API
- **Markdown rendering** — bold, headings, lists, code blocks all formatted beautifully
- Thinking indicator (animated dots) while AI is processing

### 💬 Chat Management
- **Create** new chats from the landing page
- **Rename** any chat with a modal dialog
- **Delete** chats with instant sidebar refresh
- **Persistent chat history** — all conversations saved to MongoDB
- Auto-scroll to latest message

### 🔐 Authentication
- **Register & Login** via modal — no separate auth pages
- Passwords hashed with **bcryptjs**
- **JWT tokens** stored in secure `httpOnly` cookies (7-day expiry)
- Auto user persistence — stays logged in on page refresh via `/api/auth/me`
- Logout clears cookie and redirects to home

### 🗂️ Sidebar
- Collapsible sidebar (icon-only ↔ full width)
- **Recent chats** list with active chat highlight
- Per-chat **dropdown menu** (Rename / Delete)
- Mobile-friendly with overlay backdrop
- Shows login button when logged out

### 🎨 UI/UX
- **Dark & Light mode** support via CSS variables
- Responsive design — works on mobile, tablet, desktop
- Smooth transitions and animations
- Toast notifications for all actions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose |
| Authentication | JWT + httpOnly Cookies |
| AI Provider | OpenRouter API (LLaMA 3 8B) |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Markdown | React Markdown |
| Icons | React Icons |

---

## 📁 Project Structure

```
├── app/
│   ├── page.jsx                  # Landing page (Server Component)
│   ├── [chatId]/
│   │   └── page.jsx              # Chat page (Client Component)
│   └── api/
│       ├── auth/
│       │   ├── register/route.js
│       │   ├── login/route.js
│       │   ├── logout/route.js
│       │   └── user/route.js
│       ├── chat/
│       │   ├── create/route.js   # New chat + first AI response
│       │   └── [chatId]/route.js # GET, POST,
|       |   |--- history/route.js # GET,
|       |   |--- /route.js # PATCH, DELETE
│       
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── ChatUI.jsx
│   ├── InputBox.jsx
|   ├── HeroHeading.jsx
│   ├── InputBoxContainer.jsx
│   ├── AuthForm.jsx
│   ├── Modal.jsx
│   └── MainContentWrapper.jsx
├── context/
│   └── ChatbotContext.jsx        # Global state (user, chat, sidebar)
├── model/
│   ├── userModel.js
│   └── chatModel.js
└── config/
    ├── db.js                     # MongoDB connection
    └── openRouter.js             # AI streaming config
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/listener-ai.git
cd listener-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/listener
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register user + set cookie |
| `POST` | `/api/auth/login` | Login user + set cookie |
| `POST` | `/api/auth/logout` | Clear cookie |
| `GET` | `/api/auth/user` | Get current user from cookie |
| `POST` | `/api/chat/create` | Create new chat + first AI response |
| `GET` | `/api/chat/[chatId]` | Fetch chat history |
| `POST` | `/api/chat/[chatId]` | Send message + stream AI response |
| `PATCH` | `/api/chat/` | Rename chat |
| `DELETE` | `/api/chat/` | Delete chat |
| `GET` | `/api/chat/history` | Get all chats for sidebar |

---

## 📊 Database Schema

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Chat
```js
{
  userId: ObjectId (ref: User),
  title: String,
  messages: [
    {
      role: "user" | "ai",
      text: String,
      timestamps: true
    }
  ],
  timestamps: true
}
```

---

## 📸 Screenshots

> Landing Page · Chat Interface · Sidebar with History

---

> Built with ❤️ by Mohammad Waris
