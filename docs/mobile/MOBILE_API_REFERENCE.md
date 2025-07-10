# 🔌 PakeAja CRM Mobile API Reference

> **Complete API Documentation for Mobile Developers**  
> Base URL: `https://bemrgpgwaatizgxftzgg.supabase.co`  
> Version: v1 | Authentication: Bearer Token

---

## 🔐 Authentication

### Base Configuration
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bemrgpgwaatizgxftzgg.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Login
```http
POST /auth/v1/token
Content-Type: application/json

{
  "email": "user@pakeaja.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "v1.MRj-Lagjq7cIIIQqr...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@pakeaja.com",
    "role": "sales_rep"
  }
}
```

---

## 📍 Canvassing Reports

### Create Canvassing Report
```http
POST /rest/v1/canvassing_reports
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "company_name": "PT Contoh Perusahaan",
  "company_address": "Jl. Sudirman No. 123, Jakarta",
  "contact_person": "Budi Santoso",
  "contact_position": "Manager Procurement",
  "contact_phone": "+628123456789",
  "contact_email": "budi@contoh.com",
  "visit_date": "2025-01-15",
  "visit_outcome": "interested",
  "project_segment": "protective",
  "potential_type": "value",
  "potential_value": 500000000,
  "priority": "high",
  "gps_latitude": -6.2088,
  "gps_longitude": 106.8456,
  "sales_rep_id": "uuid",
  "sales_rep_name": "John Doe"
}
```

### Get Canvassing Reports
```http
GET /rest/v1/canvassing_reports?select=*,canvassing_photos(*)&order=visit_date.desc&limit=20
Authorization: Bearer {access_token}

# Filters
GET /rest/v1/canvassing_reports?sales_rep_id=eq.{user_id}
GET /rest/v1/canvassing_reports?visit_outcome=eq.interested
```

---

## 🎯 Sales Pipeline

### Get Leads
```http
GET /rest/v1/leads?select=*,customers(*)&order=updated_at.desc
Authorization: Bearer {access_token}
```

### Create Lead
```http
POST /rest/v1/leads
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "New Project Lead",
  "description": "Potential coating project",
  "deal_type": "supply_apply",
  "estimated_value": 300000000,
  "assigned_to": "uuid"
}
```

---

## 📷 Photo Management

### Upload Photo
```http
POST /storage/v1/object/canvassing-photos/{filename}
Authorization: Bearer {access_token}
Content-Type: image/jpeg
```

### Create Photo Record
```http
POST /rest/v1/canvassing_photos
Authorization: Bearer {access_token}

{
  "report_id": "uuid",
  "photo_url": "https://storage.supabase.co/..."
}
```

---

## 📋 Activities

### Create Activity
```http
POST /rest/v1/activities
Authorization: Bearer {access_token}

{
  "lead_id": "uuid",
  "user_id": "uuid",
  "type": "phone_call",
  "title": "Follow-up call",
  "scheduled_at": "2025-01-20T14:00:00Z",
  "is_completed": true
}
```

---

## 🔄 Real-time Subscriptions

```typescript
const leadSubscription = supabase
  .channel('leads-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'leads',
    filter: `assigned_to=eq.${userId}`
  }, (payload) => {
    console.log('Lead updated:', payload);
  })
  .subscribe();
```

---

## ❌ Error Handling

### 401 Unauthorized
```json
{
  "error": "invalid_token",
  "error_description": "JWT expired"
}
```

### 422 Validation Error
```json
{
  "error": "validation_failed",
  "details": [
    {
      "field": "company_name",
      "message": "Company name is required"
    }
  ]
}
```

---

**📚 Full Documentation**: Available in Supabase Dashboard 