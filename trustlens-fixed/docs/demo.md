# TrustLens Hackathon Demo Guide (2-Minute Flow)

This guide provides step-by-step instructions for demonstrating TrustLens during hackathon judging.

## 2-Minute Demo Script

1. **Step 1: Open Landing Page** (0:00 - 0:20)
   - Open `http://localhost:3000/`.
   - Highlight tagline: *"Before you trust it, verify it."*
   - Point out the 4-layer architecture pipeline and responsible AI positioning disclaimer.

2. **Step 2: Try 1-Click Demo or Custom Upload** (0:20 - 0:45)
   - Click **Try Demo** (`/demo`) or **Verify Media** (`/verify`).
   - Select **Demo Case 2: AI Synthetic Deepfake** or drop a test deepfake image.
   - Show the live animated multi-stage analysis pipeline (1. Payload -> 2. Visual signals -> 3. AI generation -> 4. EXIF -> 5. Context -> 6. Trust Score).

3. **Step 3: Explain the Trust Score Dashboard** (0:45 - 1:20)
   - Show the radial score gauge (**24 / 100 - HIGH RISK**).
   - Highlight the action recommendation: *"Don't share until independently verified."*
   - Scroll through the 4 Multi-Vector Signal Evidence Cards.
   - Click nodes on the **Interactive Evidence Flow Graph** to explain model confidence vs overall trust score.

4. **Step 4: Generate Verification Passport & Scan QR Code** (1:20 - 2:00)
   - Click **Generate Verification Passport**.
   - Show the generated certificate with ID `TL-XXXXXX` and dynamic QR code.
   - Click **Copy Link** or scan the QR code to open the public verification view (`/passport/TL-XXXXXX`).
