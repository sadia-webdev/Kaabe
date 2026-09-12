# 🤖 Kaabe AI Assistant for Somali Businesses

Kaabe is a SaaS-style AI assistant designed for Somali businesses.

It allows a business owner to upload their business knowledge, then uses **Retrieval-Augmented Generation (RAG)** to answer customer questions based on that information.

> **Product vision:** An AI employee that knows one business and answers that business's customers.

---

## 🎯 Project Goal

The goal of Kaabe is to build an AI assistant that can:

- Learn from a business's documents
- Retrieve relevant information when a customer asks a question
- Generate grounded answers using that information
- Support multiple businesses securely
- Store conversations and messages
- Provide a dashboard for managing the business knowledge and conversations

The current project focuses on implementing and demonstrating the **RAG pipeline**.

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │  Business Owner │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Authentication  │
                    │   Better Auth   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Dashboard    │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │  Knowledge Base │       │      Chat       │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │ PDF Extraction  │       │ Embed Question  │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │    Chunking     │       │    Pinecone     │
       │   LangChain     │       │ Similarity      │
       └────────┬────────┘       │    Search       │
                │                └────────┬────────┘
                ▼                         │
       ┌─────────────────┐                │
       │ Gemini Embedding│                │
       └────────┬────────┘                │
                │                         │
                ▼                         ▼
       ┌─────────────────────────────────────────┐
       │              Pinecone                   │
       │          Vector Database                │
       └────────────────────┬────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Gemini 2.5 Flash│
                   │  + Retrieved    │
                   │    Context      │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Customer Answer │
                   └─────────────────┘

```

---

## 🔄 RAG Pipeline

Kaabe uses Retrieval-Augmented Generation to answer questions using business-specific knowledge.

### 1. Upload

A business owner uploads a PDF containing business information.

### 2. Extract

The PDF content is extracted using LangChain's `PDFLoader`.

### 3. Chunk

The extracted content is split into smaller chunks using `RecursiveCharacterTextSplitter`.

Current configuration:

```text
chunkSize: 1000
chunkOverlap: 200

```

### 4. Embed

Each chunk is converted into a vector using Google's:

```text
gemini-embedding-001

```

The embeddings use a **3072-dimensional vector space**.

### 5. Store

The vectors are stored in Pinecone together with metadata:

```text
businessId
documentId
text

```

The metadata allows retrieval to be restricted to the current business.

### 6. Retrieve

When a customer asks a question:

1. The question is embedded.
2. Pinecone performs a similarity search.
3. The search is filtered by `businessId`.
4. Only sufficiently relevant results are returned.

The current implementation uses a similarity threshold of:

```text
0.70

```

### 7. Generate

The retrieved context is provided to Gemini 2.5 Flash.

Gemini generates an answer based on the retrieved business information.

If relevant information cannot be retrieved, the assistant does not invent an answer.

---

## 💬 Example

For the test business **Sahal Restaurant**, the knowledge base contains information such as:

- Menu items
- Prices
- Opening hours
- Location
- Services
- Restaurant policies
- Frequently asked questions

Example question:

```text
What time does Sahal Restaurant close?

```

The system retrieves the relevant chunk from Pinecone and uses it to generate the answer.

For information that is not present in the knowledge base:

```text
Does Sahal Restaurant have a swimming pool?

```

The assistant responds that it does not have information about a swimming pool rather than inventing one.

---

## 🔐 Security & Multi-Tenancy

Kaabe is designed with business isolation in mind.

### Authentication

Better Auth protects dashboard and API access.

### Business Ownership

A user's business is retrieved using the authenticated user's ID rather than accepting a user ID from the client.

### Vector Isolation

Pinecone queries include a business filter:

```text
businessId = currentBusiness.id

```

This prevents retrieval from another business's knowledge.

### Conversation Ownership

Before using an existing conversation, the API verifies that the conversation belongs to the authenticated user.

Unauthorized access returns:

```text
403 Forbidden

```

### Message Ownership

Messages are stored with both:

```text
conversationId
userId

```

---

## 💾 Data Storage

Kaabe uses two types of storage.

### PostgreSQL — Neon

Used for application data:

- Users
- Sessions
- Businesses
- Documents
- Conversations
- Messages

Database access is handled through **Drizzle ORM**.

### Pinecone

Used for vector data:

- Document embeddings
- Chunk text
- Business metadata
- Document metadata

This separation allows PostgreSQL to manage application state while Pinecone handles semantic retrieval.

---

## 🧰 Tech Stack


| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| Next.js           | Full-stack web application       |
| React             | User interface                   |
| TypeScript        | Type safety                      |
| Tailwind CSS      | Styling                          |
| Better Auth       | Authentication                   |
| PostgreSQL / Neon | Application database             |
| Drizzle ORM       | Database queries and schema      |
| Pinecone          | Vector database                  |
| LangChain         | PDF processing and text chunking |
| Gemini Embeddings | Text embeddings                  |
| Gemini 2.5 Flash  | AI response generation           |
| AI SDK            | AI/chat streaming                |


---

## 📁 Project Structure

```text
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   │
│   └── dashboard/
│       ├── chat/
│       ├── knowledge/
│       ├── analytics/
│       ├── settings/
│       ├── error.tsx
│       └── page.tsx
│
├── components/
│   ├── chat.tsx
│   ├── app-sidebar.tsx
│   └── message-trend-chart.tsx
│
├── db/
│   ├── drizzle.ts
│   └── schema.ts
│
├── lib/
│   ├── auth.ts
│   ├── embeddings.ts
│   ├── pinecone.ts
│   └── search.ts
│
├── drizzle/
│
├── public/
│
├── .env.local
├── drizzle.config.ts
├── package.json
└── README.md

```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-directory>

```

### 2. Install dependencies

```bash
pnpm install

```

### 3. Configure environment variables

Create a `.env.local` file:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_GENERATIVE_AI_API_KEY=
PINECONE_API_KEY=

```

Fill in the required values for:

- Neon PostgreSQL
- Better Auth
- Google OAuth
- Google Gemini
- Pinecone

### 4. Run database migrations

```bash
pnpm drizzle-kit migrate

```

### 5. Start the development server

```bash
pnpm dev

```

Then open:

```text
http://localhost:3000

```

---

## 🧪 Testing the RAG Pipeline

A simple way to test the system is:

1. Create an account.
2. Create a business.
3. Open **Knowledge Base**.
4. Upload a business PDF.
5. Wait for the document to be processed.
6. Open **Chat**.
7. Ask questions about the uploaded business.
8. Ask a question that is unrelated to the knowledge base and verify that the assistant does not fabricate an answer.
9. Refresh the conversation and verify that messages persist.

---

## 📊 Current Features

### Authentication

- Email/password authentication
- Google authentication
- Protected dashboard
- Logout

### Business

- Business onboarding
- Authenticated business ownership
- One business per user in the current MVP

### Knowledge Base

- PDF upload
- PDF text extraction
- Document chunking
- Gemini embeddings
- Pinecone vector storage
- Business-level metadata filtering

### AI Chat

- Semantic retrieval
- Relevance threshold
- Gemini-powered answers
- Streaming responses
- Conversation persistence
- User/assistant message persistence
- Conversation titles
- Previous conversation loading

### Dashboard

- Business overview
- Knowledge base overview
- Recent conversations
- Message activity
- Knowledge document statistics

---

## 🚧 Future Improvements

Kaabe's long-term vision includes:

- Somali + English conversational support
- WhatsApp integration
- Business analytics
- More knowledge formats
- Improved retrieval and reranking
- Source citations in responses
- Business-specific AI configuration
- Customer conversation analytics
- Subscription and SaaS billing
- Multiple business/team members
- Automated knowledge updates

---

## 🎯 Project Vision

Kaabe is being built around a simple idea:

> **Give every Somali business an AI employee that knows their business.**

Instead of giving customers generic AI answers, Kaabe retrieves information from the business's own knowledge and uses it to provide relevant answers.

The long-term goal is to make this technology practical and accessible for businesses in Somalia and beyond.

---

## 👩🏽‍💻 Built By

**Sadia Mahmoud**

Computer Science Student & Full-Stack / AI Developer

Building practical AI products for Somali businesses.

# ⚙️ Getting Started



## Prerequisites

Make sure you have:

- Node.js
- npm
- PostgreSQL database
- Neon account
- Pinecone account
- Google AI / Gemini API key

---



## 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

---



## 2. Install dependencies

```bash
npm install
```

---



## 3. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=your_neon_database_url

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=rag-documents
```

> Never commit your `.env` file or expose API keys in client-side code.

Use the project's actual environment variable names if they differ from the example above.

---



## 4. Set up the database

Run the project's Drizzle database commands:

```bash
npm run db:generate
npm run db:migrate
```

If your local project uses different database scripts, use the commands defined in `package.json`.

---



## 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

The next major product milestone is expanding this foundation into a complete Somali-business AI platform with analytics, multilingual support, and WhatsApp integration.