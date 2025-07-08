# CLAUDE.md - Automated CRM/ERP Development Assistant

## Project Context
- **Goal**: Build comprehensive CRM/ERP for Indonesian coating/painting industry
- **Company**: Distributor & applicator for NIPPON, JOTUN, KANSAI, DULUX, SKK, PROPAN
- **Users**: Sales team, estimators, project managers, foremen, clients
- **Approach**: Maximum automation, minimal manual configuration
- **Focus**: What the app does for users, not how it's built

## Business Model Understanding
- **Direct partnership** with paint principals (better pricing than competitors)
- **Dual role**: Distributor AND applicator
- **Specialization**: Protective, decorative, marine, floor, texture coatings
- **Target market**: Indonesia (metric system, Rupiah currency)
- **Project sizes**: 50m² to 50,000m² 
- **Competitive advantage**: Specialized expertise + better pricing

## Core Development Philosophy
1. **Automate all technical decisions** - Use proven patterns
2. **Focus on user workflows** - I'll handle the technical implementation
3. **Use low-code/no-code tools** where possible
4. **Generate boilerplate code** automatically
5. **Test through user scenarios** not unit tests
6. **Mobile-first** - Field workers use phones/tablets

## Automated Tech Stack

### Complete Full-Stack Solution: Supabase + Next.js
- **Database**: Supabase auto-generates APIs from schema
- **Auth**: Built-in with social logins
- **Real-time**: Built into Supabase for live updates
- **Storage**: Supabase Storage for photos/documents
- **Type Safety**: Automatic from database to frontend
- **Mobile**: Progressive Web App + React Native later

## System Modules Overview

### 1. Sales Pipeline Management
- **Daily reporting** by sales team
- **Lead tracking** from first contact to won/lost
- **Multi-view**: Kanban, list, calendar views
- **Activity logging**: Calls, visits, emails with outcomes
- **Automatic metrics**: Conversion rates, cycle time
- **Mobile app** for field sales

### 2. Coating Calculator System
- **Multi-brand support**: All principal products
- **Indonesian market**: Metric units, Rupiah, local materials
- **Spreading rates**: Unique per material per DFT
- **Package optimization**: Minimize waste or cost
- **System templates**: Save and reuse coating systems
- **Additional calculators**: Thinner, abrasives, labor, equipment

### 3. Project Management
- **Auto-creation** from won deals
- **Gantt charts** with weather integration
- **Resource planning**: Workers, equipment, materials
- **Progress tracking**: Daily reports from site
- **Quality control**: Digital checklists, DFT readings
- **Photo documentation**: GPS-tagged progress photos

### 4. Client Portal
- **Self-service** project tracking
- **Live progress** with simplified Gantt
- **Document library**: Warranties, certificates, reports
- **Photo galleries**: Before/after, progress photos
- **Maintenance requests**: Post-project services
- **Coating history**: All work done on their properties

### 5. Analytics & Intelligence
- **Sales performance**: By rep, by product type
- **Estimator accuracy**: Actual vs estimated tracking
- **Project profitability**: By type, client, manager
- **Material efficiency**: Usage vs estimates
- **Predictive insights**: Maintenance needs, inventory

### 6. AI Chat Integration
- **Natural language queries** in English/Indonesian
- **Business insights**: "Show top customers this month"
- **Cost control**: <$0.50/query, mock mode for development
- **Role-based access**: Sales see their data only
- **Actionable responses**: Tables, charts, action buttons

## Database Design Patterns

### Multi-Tenant Architecture
```sql
-- All tables include organization_id for future scaling
-- Row Level Security (RLS) for data isolation
-- Audit fields: created_at, updated_at, created_by
```

### Key Entities
1. **Leads & Opportunities**: Sales pipeline
2. **Customers & Contacts**: CRM data
3. **Coating Systems**: Reusable templates
4. **Materials**: Products with packaging/pricing
5. **Projects**: From estimation to completion
6. **Daily Reports**: Progress, quality, issues
7. **Warranties**: Digital tracking with reminders

## Business Workflow Automation

### Sales to Project Flow
```
Lead → Qualify → Site Survey → Estimate → Proposal → Win → Project
  ↓        ↓          ↓            ↓          ↓        ↓       ↓
Track   Validate   Photos     Calculate   Quote    Convert  Execute
```

### Daily Operations Flow
```
Morning: Sales update pipeline → Foreman check weather → Plan day
During: Log activities → Report progress → Track materials
Evening: Submit reports → Update clients → Plan tomorrow
```

### Quality Control Flow
```
Apply coating → Measure DFT → Photo document → Inspector approve → Client sign-off
```

## Mobile-First Features

### Sales App
- Quick lead entry
- Photo capture with notes
- Offline capability
- Push notifications for follow-ups

### Foreman App  
- Daily reporting wizard
- Material barcode scanning
- Progress photos with markup
- Weather alerts

### Inspector App
- Digital checklists
- DFT reading entry
- Non-conformance reports
- Certificate generation

## Integration Points

### External Systems
- **Weather API**: Real-time conditions for scheduling
- **WhatsApp Business**: Client notifications
- **Google Maps**: Site locations and routing
- **Principal systems**: For material pricing/availability

### Future Integrations
- **Accounting software**: Invoice sync
- **HR systems**: Worker time tracking
- **IoT sensors**: Temperature/humidity monitoring
- **Drones**: Aerial progress tracking

## Development Approach

### You Describe What Users Need → I Build It

```markdown
Example:
YOU: "Sales team needs to see their pipeline on mobile"

ME: I'll automatically:
1. Design the mobile-optimized UI
2. Create the API endpoints
3. Add offline capability
4. Set up real-time sync
5. Include push notifications
```

## Performance & Scalability

### Targets
- **Page load**: <2 seconds on 4G
- **Offline capable**: Critical features work without internet
- **Data sync**: Real-time where needed, batch where possible
- **Storage efficient**: Compress photos, archive old data

## Security & Compliance

### Data Protection
- **Role-based access**: Granular permissions
- **Audit trails**: All changes tracked
- **Encryption**: At rest and in transit
- **Backups**: Automated daily with 30-day retention

### Indonesian Compliance
- **Tax compliance**: NPWP fields where needed
- **Language**: Bilingual UI (Indonesian/English)
- **Currency**: Proper Rupiah formatting
- **Dates**: DD/MM/YYYY format

## Quick Commands for Common Needs

### Database Operations
```typescript
// Just ask me:
"Add commission tracking to sales"
"Create warranty reminder system"
"Set up inventory alerts"
```

### UI Components
```typescript
// Request any UI:
"Mobile-friendly project gallery"
"Gantt chart with weather overlay"  
"Sales dashboard with charts"
"DFT measurement form"
```

### Business Logic
```typescript
// Describe the rule:
"Auto-assign leads by territory"
"Calculate commissions with tiers"
"Alert if project margin below 25%"
```

## Deployment Strategy

### Progressive Rollout
1. **Phase 1**: Sales pipeline + Calculator
2. **Phase 2**: Project management
3. **Phase 3**: Field reporting
4. **Phase 4**: Client portal
5. **Phase 5**: Analytics & AI

### Environment Management
- **Development**: Test new features
- **Staging**: Client demos
- **Production**: Live system

## Success Metrics

### Business KPIs
- Sales cycle reduction: Target 20%
- Estimation accuracy: Target 95%
- Project margin improvement: Target 5%
- Client satisfaction: Target 90%

### System KPIs
- User adoption: 100% in 30 days
- Mobile usage: 60% of interactions
- Data quality: 95% complete records
- System uptime: 99.9%

## Remember
- **You focus on WHAT** users need to do
- **I handle HOW** it gets done technically
- Every feature should save time or increase revenue
- Mobile experience is as important as desktop
- Data integrity is critical for analytics
- Client experience drives referrals

In Plan Mode, ask the user to save the current plan as .md file after finishing the planning