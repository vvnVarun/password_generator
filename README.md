# AI-Based Password Generator 🛡️

A secure, intelligent, and customizable web application built with **React** and **Vite**, designed to create strong, secure, and unique passwords using advanced entropy modeling, heuristic algorithms, and modern UX design principles (Crextio aesthetic).

---

## 🎯 Aim & Objectives

- **Primary Aim:** To design and develop an AI-based password generator that automatically generates strong, secure, and unique passwords based on user requirements. The system aims to improve password security by creating passwords using a combination of uppercase letters, lowercase letters, numbers, and special characters.
- **Short Aim (for College Records):** To develop an AI-based password generator that creates strong and secure passwords to protect users' personal information and improve online security.

---

## 🧠 Algorithmic & AI Concepts Used

1. **Shannon Information Entropy ($H = L \cdot \log_2 N$)**
   - Measures theoretical randomness and entropy in bits across diverse character pools ($N$) and password lengths ($L$).
   - Calculates total keyspace combinations ($2^H$) to assess brute-force vulnerability.

2. **Heuristic Strength Classifier & Expert System**
   - Evaluates passwords against **NIST SP 800-63B** digital identity guidelines.
   - Categorizes passwords into 5 security tiers (*Very Weak*, *Weak*, *Moderate*, *Strong*, and *Military-Grade*), predicting real-time crack resistance.

3. **NLP Tokenization & Contextual Mnemonic Engine**
   - Normalizes and tokenizes user-provided seed keywords (e.g., website/portal name).
   - Generates memorable, high-entropy passwords through smart casing and symbol injections.

4. **Probabilistic Leet-Speak Mutation**
   - Applies stochastic character mutation (e.g., `a` $\to$ `@`, `e` $\to$ `3`, `s` $\to$ `$`) to counter dictionary attacks and Rainbow Table matches.

5. **Cryptographically Secure PRNG (CSPRNG) & Fisher-Yates Shuffling**
   - Employs browser-native `crypto.getRandomValues()` instead of pseudo-random generators (`Math.random()`) to eliminate statistical biases.
   - Ensures an unbiased $O(n)$ uniform permutation using the Fisher-Yates shuffle algorithm.

---

## 🚀 Key Features

- **Customizable Character Sets:** Toggle uppercase, lowercase, numbers, symbols, and filter ambiguous characters (`l, 1, I, O, 0`).
- **Multiple Generation Modes:**
  - *Smart Entropy:* Uniform random cryptographic distribution.
  - *AI Passphrase:* High-entropy mnemonic multi-word phrases.
  - *Context Mnemonic:* Custom seed-based passwords.
- **Real-Time Security Diagnostics:** Entropy bits, combination count, crack-time estimates, and requirement checklists.
- **Modern UI / UX:** Crextio-inspired warm sand-gold gradient styling, interactive controls, and celebratory copy animations.
- **Clipboard History:** Quick copy functionality preserving recent generations.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (Vite)
- **Styling:** Vanilla CSS with Crextio Glassmorphism & Micro-animations
- **Icons & Effects:** Lucide React, Canvas Confetti
- **Security API:** Web Cryptography API (`crypto.getRandomValues`)
- **Deployment Target:** Vercel

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run Locally
```bash
# Clone the repository
git clone https://github.com/Jayasimha321/password_generator.git

# Navigate to project directory
cd password_generator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🌐 Deployment

The repository is configured for one-click deployment on **Vercel** via `vercel.json` SPA routing support.
