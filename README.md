<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

⭐ AI Tutor Agent

A lightweight, conversational AI Tutor built using Google AI Studio and deployed on Google Cloud.
Part of my VibeCoding creative, experimental projects combining AI, cloud engineering, and interactive learning.

🚀 Features

AI-powered tutoring using Gemini models

Google Cloud Run / Cloud Functions deployment

Fast, secure API endpoint

Simple, modular backend

Easy to integrate into apps & websites

🛠️ Tech Stack

Google AI Studio

Google Cloud Platform

Node.js / Python

REST API

⚙️ Setup
git clone https://github.com/your-username/ai-tutor-agent
cd ai-tutor-agent
npm install   # or pip install -r requirements.txt


Create .env:

GOOGLE_API_KEY=your_key
MODEL_NAME=gemini-pro


Run:

npm start     # or python main.py

☁️ Deployment

Cloud Run:

gcloud run deploy ai-tutor-agent --source .


Cloud Function:

gcloud functions deploy aiTutor --trigger-http

📘 Example Request
POST /ask
{ "question": "What is IoT?" }

🏅 Credits

Made by Debashish Kashyap
Part of VibeCoding ✨
