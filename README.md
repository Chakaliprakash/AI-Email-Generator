<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&height=195&color=0:111827,50:4338ca,100:818cf8&text=AI%20Email%20Generator&fontColor=ffffff&fontSize=40&fontAlignY=40&desc=AI%20Email%20Assistant%20%7C%20Web%20App%20%2B%20Browser%20Extension&descAlignY=64&descSize=15" width="100%" alt="AI Email Generator banner"/>

![AI](https://img.shields.io/badge/AI-Email%20Generation-4338ca?style=for-the-badge)
![Clients](https://img.shields.io/badge/Clients-Web%20%2B%20Extension-64748b?style=for-the-badge)

[Repository](https://github.com/Chakaliprakash/AI-Email-Generator) · [Issues](https://github.com/Chakaliprakash/AI-Email-Generator/issues)

</div>

---

# AI Email Generator

An AI-assisted email writing tool with a web interface, backend API, and browser extension.

## Components

- **Backend:** Spring Boot API that connects to the configured Gemini endpoint.
- **Frontend:** React application built with Vite and Material UI.
- **Browser extension:** Adds email-writing assistance to supported browser pages.

## Technology Stack

- Java 21 and Spring Boot
- React, Vite, and Material UI
- Gemini API integration
- Docker and Render deployment configuration

## Run Locally

### Backend

Configure `GEMINI_URL` and `GEMINI_KEY` as environment variables, then run:

```bash
cd "Email-Generator Backend"
./mvnw spring-boot:run
```

### Frontend

```bash
cd Email-Generator-Frontend
npm install
npm run dev
```

Set the frontend API URL to the backend address used in your environment.

### Browser Extension

1. Open your browser's extension management page.
2. Enable developer mode.
3. Choose **Load unpacked**.
4. Select the `Email-Generator-Extension/` directory.

## Deployment

The repository includes a Render service definition and a Dockerfile for the backend. Configure the required environment variables in the deployment environment.

## Security

Keep API keys in environment variables. Do not commit credentials or production secrets.

## Author

[Prakash Chakali](https://github.com/Chakaliprakash)
