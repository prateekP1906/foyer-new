# Project: DentistAI - Voice Appointment Backend
**Role:** You are a Senior Backend Developer.
**Goal:** Build a robust Node.js/Express server that acts as the brain for a Vapi.ai voice assistant.

## 1. Project Setup
- Initialize a Node.js project.
- Install: `express`, `dotenv`, `@supabase/supabase-js`, `cors`, `body-parser`.
- Create a `.env` file structure (do not fill in real keys, just placeholders).

## 2. Database Schema (Supabase)
*Instruction: Write a SQL script `setup.sql` that I can run in the Supabase SQL Editor to create these tables.*

**Table: `appointments`**
- `id` (uuid, primary key)
- `patient_name` (text)
- `phone_number` (text)
- `issue_description` (text)
- `appointment_time` (timestamp)
- `status` (text, default: 'confirmed')
- `created_at` (timestamp, default: now)

## 3. The Server Logic (`server.js`)
Create an Express server running on port 3000.

### Endpoint: POST `/vapi-webhook`
This endpoint receives function calls from Vapi. It must handle two specific "Tools":

**Tool A: `checkAvailability`**
- **Input:** `{ "requested_date": "YYYY-MM-DD", "requested_time": "HH:mm" }`
- **Logic:**
  1. Check if the time is within business hours (09:00 to 17:00).
  2. Query the `appointments` table to see if a row already exists for that exact timestamp.
  3. **Return:** JSON `{ "available": true }` or `{ "available": false, "reason": "Slot taken" }`.

**Tool B: `bookAppointment`**
- **Input:** `{ "name": "...", "phone": "...", "issue": "...", "date": "...", "time": "..." }`
- **Logic:**
  1. Insert a new row into `appointments`.
  2. **Return:** JSON `{ "success": true, "message": "Booked for [time]" }`.

## 4. Deployment Config
- Create a `render.yaml` for deployment on Render.com.
- Create a `start` script in package.json.

## 5. Immediate Action
- Write all the code files.
- Create the `setup.sql` file.
- Explain to me how to run the server locally.