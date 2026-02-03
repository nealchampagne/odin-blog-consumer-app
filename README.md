# Odin Blog Owner App

## Description

This is my implimentation of the Admin Frontend for the Blog API project from the NodeJS course of the Odin Project's Full-Stack JavaScript curriculum.

Absolutely, Neal — here’s a clean, professional, POC‑appropriate README for your **consumer (reader) frontend**. It mirrors the tone of your admin README but focuses on the public‑facing experience, the static nature of the app, and your lightweight tech choices (fetch + CSS modules).

You can drop this directly into your repo.

---

# **Reader Frontend – README**

## **Overview**
This is the **public-facing Reader Frontend** for the Odin Blog project.  
It provides a clean, lightweight interface for browsing published blog posts, reading full articles, and viewing comment threads.

This frontend is intentionally minimal — it focuses on fast load times, simple navigation, and a clear separation from the admin dashboard. All content is fetched from the standalone backend API.

The project is a **proof‑of‑concept**, designed to demonstrate a clean separation between:

- a public reader frontend  
- a private admin frontend  
- a standalone backend API  
- a managed Postgres database

---

## **Tech Stack**
- **React + Vite**  
- **TypeScript**  
- **React Router**  
- **Native `fetch` API**
- **CSS Modules** for scoped styling  
- **Vite environment variables** for API configuration
- **JWT‑based authentication** (stored in memory or localStorage depending on your setup)

---

## **Environment Variables**
The reader app communicates with the backend API using a single environment variable:

```
VITE_API_URL=https://your-backend-url.com
```

During local development:

```
VITE_API_URL=http://localhost:3000
```

This must be set before running or building the project.

---

## **Running Locally**

### **Install dependencies**
```
npm install
```

### **Start the dev server**
```
npm run dev
```

Vite will start the app on a local port (usually `5173`).

The reader UI will automatically fetch:

- paginated posts  
- individual post content  
- comment threads  

from the backend API.

---

## **Build for Production**
```
npm run build
```

The optimized static output will be placed in:

```
dist/
```

This folder can be deployed to any static hosting provider.

---

## **Deployment**
This project is designed to deploy cleanly to free static hosts such as:

- **Netlify**  
- **Vercel**  
- **Render (Static Site)**  
- **GitHub Pages** (with hash routing or a 404 fallback)  

### **Required environment variable**
Set:

```
VITE_API_URL=https://your-backend.onrender.com
```

Your hosting provider will inject this at build time.

## **Features**
- Public browsing of published posts  
- Post detail pages  
- Comment thread display  
- Pagination  
- Clean, modular CSS  
- Lightweight fetch‑based API client  
- Fast static delivery  

---

## **Project Status**
This is a **proof‑of‑concept** implementation intended to validate:

- frontend → backend API communication  
- pagination and post rendering  
- comment contribution, editing, and deletion
- deployment pipeline for static sites  
- separation between public and admin interfaces  

Future enhancements could include:

- search  
- categories/tags  
- infinite scroll