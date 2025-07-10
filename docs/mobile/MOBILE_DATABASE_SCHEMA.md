# 🗄️ PakeAja CRM Database Schema Reference

> **Complete Database Schema for Mobile Developers**  
> Database: PostgreSQL with Supabase  
> Version: v1 | Row Level Security: Enabled

---

## 🔐 Authentication & Users

### `auth.users` (Supabase Auth)
```sql
-- Managed by Supabase Auth
id                UUID PRIMARY KEY
email             VARCHAR UNIQUE NOT NULL
created_at        TIMESTAMP WITH TIME ZONE
updated_at        TIMESTAMP WITH TIME ZONE
email_confirmed_at TIMESTAMP WITH TIME ZONE
last_sign_in_at   TIMESTAMP WITH TIME ZONE
```

### `profiles` (User Profiles)
```sql
-- Extended user information
id                UUID PRIMARY KEY REFERENCES auth.users(id)
full_name         VARCHAR(255)
phone             VARCHAR(20)
role              user_role NOT NULL DEFAULT 'sales_rep'
territory         VARCHAR(255)
organization_id   UUID REFERENCES organizations(id)
is_active         BOOLEAN DEFAULT true
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Row Level Security
-- Users can only see their own profile
-- Sales managers can see their team profiles
-- Admins can see all profiles
```

### `user_role` (ENUM)
```sql
CREATE TYPE user_role AS ENUM (
  'sales_rep',
  'sales_manager', 
  'admin',
  'field_sales',
  'estimator'
);
```

---

## 🏢 Organizations & Teams

### `organizations`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
name              VARCHAR(255) NOT NULL
address           TEXT
phone             VARCHAR(20)
email             VARCHAR(255)
is_active         BOOLEAN DEFAULT true
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### `teams`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id   UUID REFERENCES organizations(id)
name              VARCHAR(255) NOT NULL
description       TEXT
manager_id        UUID REFERENCES profiles(id)
is_active         BOOLEAN DEFAULT true
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### `team_members`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
team_id           UUID REFERENCES teams(id)
user_id           UUID REFERENCES profiles(id)
joined_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
is_active         BOOLEAN DEFAULT true

-- Unique constraint
UNIQUE(team_id, user_id)
```

### `territories`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
name              VARCHAR(255) NOT NULL
description       TEXT
organization_id   UUID REFERENCES organizations(id)
is_active         BOOLEAN DEFAULT true
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### `user_territories`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id           UUID REFERENCES profiles(id)
territory_id      UUID REFERENCES territories(id)
assigned_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
is_active         BOOLEAN DEFAULT true

-- Unique constraint
UNIQUE(user_id, territory_id)
```

---

## 📍 Canvassing System

### `canvassing_reports`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- Company Information
company_name      VARCHAR(255) NOT NULL
company_address   TEXT
contact_person    VARCHAR(255)
contact_position  VARCHAR(255)
contact_phone     VARCHAR(20)
contact_email     VARCHAR(255)

-- Visit Information
visit_date        DATE NOT NULL
visit_outcome     visit_outcome_enum NOT NULL
project_segment   project_segment_enum
potential_type    potential_type_enum
potential_value   DECIMAL(15,2)
priority          priority_enum DEFAULT 'medium'

-- Next Steps
next_action       VARCHAR(255)
next_action_date  DATE
general_notes     TEXT

-- Location
gps_latitude      DECIMAL(10,8)
gps_longitude     DECIMAL(11,8)
location_address  TEXT

-- Sales Rep Information
sales_rep_id      UUID REFERENCES profiles(id) NOT NULL
sales_rep_name    VARCHAR(255)

-- Lead Conversion
lead_id           UUID REFERENCES leads(id)
converted_to_lead BOOLEAN DEFAULT false
converted_at      TIMESTAMP WITH TIME ZONE

-- Timestamps
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Indexes
CREATE INDEX idx_canvassing_reports_sales_rep_id ON canvassing_reports(sales_rep_id);
CREATE INDEX idx_canvassing_reports_visit_date ON canvassing_reports(visit_date);
CREATE INDEX idx_canvassing_reports_company_name ON canvassing_reports(company_name);
```

### `canvassing_photos`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
report_id         UUID REFERENCES canvassing_reports(id) ON DELETE CASCADE
photo_url         TEXT NOT NULL
file_size         INTEGER
mime_type         VARCHAR(100)
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Indexes
CREATE INDEX idx_canvassing_photos_report_id ON canvassing_photos(report_id);
```

### Canvassing ENUMs
```sql
-- Visit Outcomes
CREATE TYPE visit_outcome_enum AS ENUM (
  'interested',
  'not_interested',
  'follow_up_needed',
  'already_customer',
  'competitor_locked',
  'no_decision_maker',
  'budget_constraints',
  'timing_issues'
);

-- Project Segments
CREATE TYPE project_segment_enum AS ENUM (
  'decorative',
  'floor',
  'marine',
  'protective',
  'steel',
  'waterproofing',
  'others'
);

-- Potential Types
CREATE TYPE potential_type_enum AS ENUM (
  'value',
  'volume',
  'strategic'
);

-- Priority Levels
CREATE TYPE priority_enum AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);
```

---

## 🎯 Sales Pipeline

### `leads`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- Lead Information
lead_number       VARCHAR(50) UNIQUE NOT NULL
customer_id       UUID REFERENCES customers(id)
canvassing_report_id UUID REFERENCES canvassing_reports(id)
assigned_to       UUID REFERENCES profiles(id)

-- Lead Details
title             VARCHAR(255) NOT NULL
description       TEXT
stage             lead_stage_enum DEFAULT 'new'
temperature       INTEGER CHECK (temperature >= 0 AND temperature <= 100)
temperature_status temperature_status_enum

-- Deal Information
deal_type         deal_type_enum
project_segment   project_segment_enum
estimated_value   DECIMAL(15,2)
probability       INTEGER CHECK (probability >= 0 AND probability <= 100)
expected_close_date DATE

-- Contact Information
contact_name      VARCHAR(255)
contact_email     VARCHAR(255)
contact_phone     VARCHAR(20)
company_name      VARCHAR(255)

-- Lead Source
source            lead_source_enum DEFAULT 'manual'
source_details    TEXT

-- Status
status            lead_status_enum DEFAULT 'active'
closed_at         TIMESTAMP WITH TIME ZONE
closed_reason     TEXT

-- Timestamps
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Indexes
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_customer_id ON leads(customer_id);
CREATE INDEX idx_leads_canvassing_report_id ON leads(canvassing_report_id);
```

### Lead ENUMs
```sql
-- Lead Stages
CREATE TYPE lead_stage_enum AS ENUM (
  'new',
  'qualified',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost'
);

-- Temperature Status
CREATE TYPE temperature_status_enum AS ENUM (
  'cold',
  'warm',
  'hot'
);

-- Deal Types
CREATE TYPE deal_type_enum AS ENUM (
  'supply_only',
  'supply_apply',
  'apply_only',
  'consultation',
  'maintenance'
);

-- Lead Sources
CREATE TYPE lead_source_enum AS ENUM (
  'canvassing',
  'referral',
  'website',
  'social_media',
  'cold_call',
  'email_campaign',
  'trade_show',
  'manual'
);

-- Lead Status
CREATE TYPE lead_status_enum AS ENUM (
  'active',
  'inactive',
  'closed'
);
```

---

## 📋 Activities

### `activities`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- References
lead_id           UUID REFERENCES leads(id)
user_id           UUID REFERENCES profiles(id) NOT NULL
related_to_id     UUID  -- Generic reference for future use
related_to_type   VARCHAR(50)  -- 'lead', 'customer', 'canvassing_report'

-- Activity Details
type              activity_type_enum NOT NULL
title             VARCHAR(255) NOT NULL
description       TEXT
notes             TEXT

-- Scheduling
scheduled_at      TIMESTAMP WITH TIME ZONE
completed_at      TIMESTAMP WITH TIME ZONE
duration_minutes  INTEGER
is_completed      BOOLEAN DEFAULT false

-- Outcome
outcome           TEXT
next_action       VARCHAR(255)
follow_up_date    DATE

-- Timestamps
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Indexes
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_scheduled_at ON activities(scheduled_at);
CREATE INDEX idx_activities_type ON activities(type);
```

### `activity_type_enum`
```sql
CREATE TYPE activity_type_enum AS ENUM (
  'phone_call',
  'email',
  'meeting',
  'site_visit',
  'proposal_sent',
  'follow_up',
  'negotiation',
  'demo',
  'quotation',
  'contract',
  'other'
);
```

---

## 🏢 Customers

### `customers`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- Basic Information
name              VARCHAR(255) NOT NULL
email             VARCHAR(255)
phone             VARCHAR(20)
company           VARCHAR(255)
industry          VARCHAR(255)
website           VARCHAR(255)

-- Address Information
address           TEXT
city              VARCHAR(255)
province          VARCHAR(255)
postal_code       VARCHAR(20)
country           VARCHAR(255) DEFAULT 'Indonesia'

-- Customer Details
customer_type     customer_type_enum DEFAULT 'prospect'
status            customer_status_enum DEFAULT 'active'
notes             TEXT

-- Sales Information
total_projects    INTEGER DEFAULT 0
total_revenue     DECIMAL(15,2) DEFAULT 0
last_project_date DATE
assigned_to       UUID REFERENCES profiles(id)

-- Timestamps
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Indexes
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_company ON customers(company);
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
```

### Customer ENUMs
```sql
CREATE TYPE customer_type_enum AS ENUM (
  'prospect',
  'customer',
  'vip_customer',
  'inactive'
);

CREATE TYPE customer_status_enum AS ENUM (
  'active',
  'inactive',
  'blacklisted'
);
```

---

## 📊 Daily Reports

### `daily_reports`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- Report Information
user_id           UUID REFERENCES profiles(id) NOT NULL
report_date       DATE NOT NULL
territory         VARCHAR(255)

-- Activities Summary
visits_planned    INTEGER DEFAULT 0
visits_completed  INTEGER DEFAULT 0
calls_made        INTEGER DEFAULT 0
emails_sent       INTEGER DEFAULT 0

-- Results
leads_generated   INTEGER DEFAULT 0
appointments_set  INTEGER DEFAULT 0
proposals_sent    INTEGER DEFAULT 0

-- Challenges & Notes
challenges        TEXT
achievements      TEXT
next_day_plan     TEXT
general_notes     TEXT

-- Metrics
total_distance_km DECIMAL(8,2)
working_hours     DECIMAL(4,2)

-- Status
status            report_status_enum DEFAULT 'draft'
submitted_at      TIMESTAMP WITH TIME ZONE
approved_at       TIMESTAMP WITH TIME ZONE
approved_by       UUID REFERENCES profiles(id)

-- Timestamps
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Unique constraint
UNIQUE(user_id, report_date)

-- Indexes
CREATE INDEX idx_daily_reports_user_id ON daily_reports(user_id);
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date);
```

### `report_status_enum`
```sql
CREATE TYPE report_status_enum AS ENUM (
  'draft',
  'submitted',
  'approved',
  'rejected'
);
```

---

## 🔔 Notifications

### `notifications`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- Target User
user_id           UUID REFERENCES profiles(id) NOT NULL

-- Notification Content
type              notification_type_enum NOT NULL
title             VARCHAR(255) NOT NULL
message           TEXT NOT NULL
data              JSONB  -- Additional data for the notification

-- Status
read              BOOLEAN DEFAULT false
read_at           TIMESTAMP WITH TIME ZONE

-- Timestamps
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
expires_at        TIMESTAMP WITH TIME ZONE

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### `notification_type_enum`
```sql
CREATE TYPE notification_type_enum AS ENUM (
  'activity_reminder',
  'lead_update',
  'new_assignment',
  'daily_report_due',
  'system_announcement',
  'performance_milestone',
  'follow_up_reminder'
);
```

---

## 🔄 Sync Operations

### `sync_logs`
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id           UUID REFERENCES profiles(id) NOT NULL
operation_type    sync_operation_enum NOT NULL
table_name        VARCHAR(255) NOT NULL
record_id         UUID
local_id          VARCHAR(255)  -- For offline sync mapping
status            sync_status_enum DEFAULT 'pending'
error_message     TEXT
retry_count       INTEGER DEFAULT 0
created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
completed_at      TIMESTAMP WITH TIME ZONE

-- Indexes
CREATE INDEX idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
```

### Sync ENUMs
```sql
CREATE TYPE sync_operation_enum AS ENUM (
  'create',
  'update',
  'delete',
  'batch_create',
  'batch_update'
);

CREATE TYPE sync_status_enum AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);
```

---

## 🔐 Row Level Security (RLS) Policies

### Key RLS Policies

#### `canvassing_reports`
```sql
-- Users can only see their own reports
CREATE POLICY "Users can view own canvassing reports" ON canvassing_reports
FOR SELECT USING (auth.uid() = sales_rep_id);

-- Users can only create reports for themselves
CREATE POLICY "Users can create own canvassing reports" ON canvassing_reports
FOR INSERT WITH CHECK (auth.uid() = sales_rep_id);

-- Managers can see their team's reports
CREATE POLICY "Managers can view team canvassing reports" ON canvassing_reports
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_members tm
    JOIN teams t ON tm.team_id = t.id
    WHERE tm.user_id = sales_rep_id
    AND t.manager_id = auth.uid()
  )
);
```

#### `leads`
```sql
-- Users can only see assigned leads
CREATE POLICY "Users can view assigned leads" ON leads
FOR SELECT USING (auth.uid() = assigned_to);

-- Users can update assigned leads
CREATE POLICY "Users can update assigned leads" ON leads
FOR UPDATE USING (auth.uid() = assigned_to);
```

#### `activities`
```sql
-- Users can only see their own activities
CREATE POLICY "Users can view own activities" ON activities
FOR SELECT USING (auth.uid() = user_id);

-- Users can only create activities for themselves
CREATE POLICY "Users can create own activities" ON activities
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 📱 Mobile-Optimized Views

### `mobile_canvassing_summary`
```sql
CREATE VIEW mobile_canvassing_summary AS
SELECT 
  id,
  company_name,
  contact_person,
  visit_date,
  visit_outcome,
  project_segment,
  potential_value,
  priority,
  converted_to_lead,
  gps_latitude,
  gps_longitude,
  (SELECT COUNT(*) FROM canvassing_photos cp WHERE cp.report_id = cr.id) as photo_count,
  created_at
FROM canvassing_reports cr
WHERE sales_rep_id = auth.uid()
ORDER BY visit_date DESC;
```

### `mobile_lead_pipeline`
```sql
CREATE VIEW mobile_lead_pipeline AS
SELECT 
  id,
  lead_number,
  title,
  company_name,
  contact_name,
  stage,
  temperature_status,
  estimated_value,
  probability,
  expected_close_date,
  (SELECT COUNT(*) FROM activities a WHERE a.lead_id = l.id AND a.is_completed = false) as pending_activities,
  created_at,
  updated_at
FROM leads l
WHERE assigned_to = auth.uid()
AND status = 'active'
ORDER BY temperature DESC, expected_close_date ASC;
```

---

## 🔧 Useful Database Functions

### `convert_canvassing_to_lead`
```sql
CREATE OR REPLACE FUNCTION convert_canvassing_to_lead(report_id UUID)
RETURNS UUID AS $$
DECLARE
    new_lead_id UUID;
    report_data RECORD;
BEGIN
    -- Get canvassing report data
    SELECT * INTO report_data FROM canvassing_reports WHERE id = report_id;
    
    -- Create new lead
    INSERT INTO leads (
        title,
        description,
        company_name,
        contact_name,
        contact_email,
        contact_phone,
        assigned_to,
        project_segment,
        estimated_value,
        canvassing_report_id,
        source
    ) VALUES (
        report_data.company_name || ' - ' || report_data.project_segment,
        report_data.general_notes,
        report_data.company_name,
        report_data.contact_person,
        report_data.contact_email,
        report_data.contact_phone,
        report_data.sales_rep_id,
        report_data.project_segment,
        report_data.potential_value,
        report_id,
        'canvassing'
    ) RETURNING id INTO new_lead_id;
    
    -- Update canvassing report
    UPDATE canvassing_reports 
    SET 
        lead_id = new_lead_id,
        converted_to_lead = true,
        converted_at = NOW()
    WHERE id = report_id;
    
    RETURN new_lead_id;
END;
$$ LANGUAGE plpgsql;
```

### `get_personal_kpi`
```sql
CREATE OR REPLACE FUNCTION get_personal_kpi(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'visits_today', (
            SELECT COUNT(*) FROM canvassing_reports 
            WHERE sales_rep_id = user_id AND visit_date = CURRENT_DATE
        ),
        'visits_this_month', (
            SELECT COUNT(*) FROM canvassing_reports 
            WHERE sales_rep_id = user_id 
            AND EXTRACT(MONTH FROM visit_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM visit_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        ),
        'leads_generated', (
            SELECT COUNT(*) FROM leads 
            WHERE assigned_to = user_id 
            AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        ),
        'pipeline_value', (
            SELECT COALESCE(SUM(estimated_value), 0) FROM leads 
            WHERE assigned_to = user_id AND status = 'active'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Mobile App Database Best Practices

### 1. **Connection Management**
```typescript
// Configure connection pooling
const supabase = createClient(url, anonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
```

### 2. **Efficient Queries**
```sql
-- Use selective fields for mobile
SELECT id, company_name, visit_date, visit_outcome, potential_value
FROM canvassing_reports
WHERE sales_rep_id = $1
ORDER BY visit_date DESC
LIMIT 20;

-- Use indexes for better performance
CREATE INDEX CONCURRENTLY idx_canvassing_reports_sales_rep_visit_date 
ON canvassing_reports(sales_rep_id, visit_date DESC);
```

### 3. **Batch Operations**
```typescript
// Batch insert for offline sync
const batchInsert = async (reports: CanvassingReport[]) => {
  const { data, error } = await supabase
    .from('canvassing_reports')
    .insert(reports);
  
  return { data, error };
};
```

### 4. **Real-time Subscriptions**
```typescript
// Subscribe to relevant changes only
const subscription = supabase
  .channel('user-data')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'leads',
    filter: `assigned_to=eq.${userId}`
  }, handleLeadChange)
  .subscribe();
```

---

**💾 Database**: PostgreSQL 15+  
**🔐 Security**: Row Level Security Enabled  
**🌍 Region**: Asia Pacific (ap-southeast-1)  
**📊 Monitoring**: Available in Supabase Dashboard 