# TrustLens REST API Specification

Base URL: `http://localhost:8000/api/v1`

## Endpoints

### 1. Health Check
- **GET** `/health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "TrustLens API",
  "version": "1.0.0",
  "demo_mode": true,
  "deepfake_provider": "mock"
}
```

### 2. Analyze Media
- **POST** `/analyze`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (binary payload: JPG, PNG, WEBP, MP4)
- **Response**: `AnalysisResponse` JSON object containing `trust_engine`, `ai_generation`, `manipulation`, `metadata`, `context`, and `overall_explanation`.

### 3. Generate Verification Passport
- **POST** `/passport/{analysis_id}`
- **Query Params**: `origin` (optional base URL for QR code verification URL)
- **Response**: `PassportResponse` JSON object containing `passport_id` (`TL-XXXXXX`), `qr_code_data_url`, and `verification_url`.

### 4. Fetch Public Passport
- **GET** `/passport/view/{passport_id}`
- **Response**: Publicly sanitized `PassportResponse`.

### 5. Fetch Demo Case
- **GET** `/demo/{demo_id}`
- **Params**: `demo_id` = `authentic` | `deepfake` | `out_of_context`
- **Response**: Pre-configured `AnalysisResponse`.
