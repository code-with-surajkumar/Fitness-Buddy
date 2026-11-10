# 🏋️ Fitness Buddy — AI-Powered Health & Fitness Coach

> A conversational AI fitness coach powered by **IBM Granite** on **IBM watsonx.ai**, built with Node.js + Express.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **AI Chat** | Multi-turn conversational fitness coaching via IBM Granite |
| 🏋️ **Workout Planner** | Personalised home workout plans by goal, level & equipment |
| 🥗 **Meal Suggester** | Nutritious meal ideas with macros, by diet type |
| ⚡ **Motivation Engine** | Personalised motivational messages & habit tips |
| 📅 **Weekly Check-in** | Progress-aware weekly coaching feedback |
| 🎯 **Habit Coaching** | Actionable habit-building tips using science-backed methods |

---

## 🛠 Tech Stack

- **AI Engine**: IBM Granite (`ibm/granite-13b-chat-v2`) via **IBM watsonx.ai**
- **Cloud**: IBM Cloud (IAM authentication)
- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla HTML/CSS/JS (no build step required)
- **Security**: Helmet, CORS, Rate limiting

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js ≥ 18
- An **IBM Cloud** account with watsonx.ai access  
  → [Sign up free](https://cloud.ibm.com/registration)

### 2. Clone & install dependencies

```bash
git clone <your-repo>
cd FitnessBuddy
npm install
```

### 3. Configure environment variables

```bash
# Copy the template
copy .env.example .env
```

Open `.env` and fill in your credentials:

```env
IBM_API_KEY=your_ibm_cloud_api_key_here
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_PROJECT_ID=your_watsonx_project_id_here
IBM_GRANITE_MODEL_ID=ibm/granite-13b-chat-v2
```

#### How to get IBM credentials:

| Credential | Where to find it |
|---|---|
| `IBM_API_KEY` | [cloud.ibm.com/iam/apikeys](https://cloud.ibm.com/iam/apikeys) → Create API key |
| `IBM_WATSONX_URL` | Your region: `https://<region>.ml.cloud.ibm.com` |
| `IBM_WATSONX_PROJECT_ID` | watsonx.ai → Your Project → Manage → General → Project ID |

### 4. Run the server

```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

Open your browser at **http://localhost:3000** 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a chat message, get AI reply |
| `DELETE` | `/api/chat/:sessionId` | Clear conversation session |
| `POST` | `/api/workout/plan` | Generate personalised workout plan |
| `GET` | `/api/workout/tip` | Daily workout tip |
| `POST` | `/api/nutrition/meal` | Get a meal suggestion |
| `GET` | `/api/nutrition/tip` | Daily nutrition tip |
| `POST` | `/api/motivation` | Get a motivational message |
| `GET` | `/api/motivation/habit` | Habit-building tip |
| `POST` | `/api/motivation/checkin` | Weekly fitness check-in |
| `GET` | `/api/health` | Health check + Granite connectivity |

### Example: Chat request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Give me a beginner 20-minute home workout"}'
```

### Example: Workout plan

```bash
curl -X POST http://localhost:3000/api/workout/plan \
  -H "Content-Type: application/json" \
  -d '{"goal":"weightloss","level":"beginner","equipment":"none","duration":30}'
```

### Example: Meal suggestion

```bash
curl -X POST http://localhost:3000/api/nutrition/meal \
  -H "Content-Type: application/json" \
  -d '{"mealType":"breakfast","diet":"highprotein","goal":"muscle building"}'
```

---

## 📁 Project Structure

```
FitnessBuddy/
├── .env.example          # Environment variables template
├── package.json          # Dependencies & scripts
├── README.md             # This file
├── public/
│   └── index.html        # Frontend SPA (single-page chat UI)
└── server/
    ├── index.js           # Express app entry point
    ├── routes/
    │   ├── chat.js        # Chat API route
    │   ├── workout.js     # Workout API route
    │   ├── nutrition.js   # Nutrition API route
    │   └── motivation.js  # Motivation API route
    └── services/
        ├── granite.js         # IBM Granite / watsonx.ai client
        ├── chatService.js     # Multi-turn conversation manager
        ├── workoutService.js  # Workout plan generator
        ├── nutritionService.js # Meal suggestion generator
        └── motivationService.js # Motivation & habit coaching
```

---

## 🔑 IBM Cloud Lite (Free Tier) Notes

- IBM Cloud Lite services are **free** with no credit card required
- watsonx.ai Lite tier allows limited API calls per month
- IBM Granite models available: `granite-13b-chat-v2`, `granite-13b-instruct-v2`
- Monitor usage at [cloud.ibm.com/resources](https://cloud.ibm.com/resources)

---

## ⚙️ Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `IBM_API_KEY` | ✅ | — | IBM Cloud IAM API key |
| `IBM_WATSONX_URL` | ✅ | — | watsonx.ai service URL |
| `IBM_WATSONX_PROJECT_ID` | ✅ | — | watsonx.ai project ID |
| `IBM_GRANITE_MODEL_ID` | ❌ | `ibm/granite-13b-chat-v2` | Granite model to use |
| `PORT` | ❌ | `3000` | Server port |
| `NODE_ENV` | ❌ | `development` | Environment |
| `AI_MAX_NEW_TOKENS` | ❌ | `600` | Max tokens per response |
| `AI_TEMPERATURE` | ❌ | `0.75` | Response creativity (0–1) |

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

*Built with ❤️ using IBM Granite on IBM Cloud watsonx.ai*
