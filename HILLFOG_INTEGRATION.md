# Hillfog Backend Integration

This document describes the integration between the Next.js UI and the original Hillfog Spring Boot backend.

## Overview

The Next.js UI has been enhanced with a comprehensive integration layer that bridges the modern React frontend with the original Hillfog backend system. This integration maintains full compatibility with existing business logic while providing a modern, responsive user interface.

## Architecture

### Integration Components

1. **API Adapter Layer** (`src/lib/adapters/hillfog-api-adapter.ts`)
   - Bridges RESTful API calls to Hillfog's action-based endpoints
   - Handles data transformation between formats
   - Provides type-safe API interactions

2. **Authentication Bridge** (`src/lib/adapters/auth-adapter.ts`)
   - Integrates with Hillfog's session-based authentication
   - Provides modern authentication patterns for the UI
   - Handles session management and validation

3. **Data Transformation Utilities** (`src/lib/utils/data-transformer.ts`)
   - Transforms data between Hillfog format and UI format
   - Handles field mapping (e.g., `oid` ↔ `id`)
   - Converts data types (BigDecimal ↔ number, dates, etc.)

4. **Enhanced API Client** (`src/api/hillfogClient.ts`)
   - Updated to use the new adapter layer
   - Maintains backward compatibility with existing code
   - Provides both legacy and modern API methods

5. **TypeScript Types** (`src/types/hillfog.ts`)
   - Complete type definitions matching Hillfog data models
   - Ensures type safety across the application
   - Includes all entities: Scorecards, KPIs, OKRs, Employees, etc.

## Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Hillfog Backend URL
NEXT_PUBLIC_HILLFOG_BACKEND_URL=http://localhost:8088
```

### Backend Configuration

The Hillfog backend should be running on the configured URL (default: `http://localhost:8088`).

## API Mapping

### Original Hillfog Endpoints → Next.js UI

| Feature | Original Endpoint | UI Method | Description |
|---------|------------------|-----------|-------------|
| **Authentication** |
| Login | `/login.action` | `hillfogClient.login()` | User authentication |
| Logout | `/logout.action` | `hillfogClient.logout()` | User logout |
| Session Check | `/checkUserSession.action` | `hillfogClient.checkSession()` | Validate session |
| **Scorecards** |
| List | `/hfScorecardQueryGridJson` | `hillfogClient.getScorecards()` | Get scorecard list |
| Get | `/hfScorecardQueryGridJson?oid=X` | `hillfogClient.getScorecard(id)` | Get single scorecard |
| Create | `/hfScorecardSaveJson` | `hillfogClient.createScorecard()` | Create new scorecard |
| Update | `/hfScorecardUpdateJson` | `hillfogClient.updateScorecard()` | Update scorecard |
| Delete | `/hfScorecardDeleteJson` | `hillfogClient.deleteScorecard()` | Delete scorecard |
| **KPIs** |
| List | `/hfKpiBaseQueryGridJson` | `hillfogClient.getKpis()` | Get KPI list |
| Get | `/hfKpiBaseQueryGridJson?oid=X` | `hillfogClient.getKpi(id)` | Get single KPI |
| Create | `/hfKpiBaseSaveJson` | `hillfogClient.createKpi()` | Create new KPI |
| Update | `/hfKpiBaseUpdateJson` | `hillfogClient.updateKpi()` | Update KPI |
| Delete | `/hfKpiBaseDeleteJson` | `hillfogClient.deleteKpi()` | Delete KPI |
| **Measure Data** |
| Get | `/hfMeasureDataBodyJson` | `hillfogClient.getMeasureData()` | Get measure data |
| Update | `/hfMeasureDataUpdateJson` | `hillfogClient.updateMeasureData()` | Update measure data |
| **Reports** |
| KPI Report | `/hfKpiBaseReportJson` | `hillfogClient.getKpiReport()` | Generate KPI report |
| OKR Report | `/hfOkrBaseReportJson` | `hillfogClient.getOkrReport()` | Generate OKR report |
| Scorecard Report | `/hfScorecardReportJson` | `hillfogClient.getScorecardReport()` | Generate scorecard report |

## Data Transformation

### Field Mapping

| Hillfog Field | UI Field | Transformation |
|---------------|----------|----------------|
| `oid` | `id` | Direct mapping |
| `cdateString` | `createdDate` | Date format conversion |
| `udateString` | `updatedDate` | Date format conversion |
| `weight` (BigDecimal) | `weight` (number) | String to number |
| `target` (BigDecimal) | `target` (number) | String to number |
| `active` ('Y'/'N') | `active` (boolean) | String to boolean |

### Example Transformation

```typescript
// Original Hillfog format
{
  "oid": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Sales Revenue",
  "target": "1000000.00",
  "cdateString": "2023-12-01 10:30:00",
  "active": "Y"
}

// Transformed UI format
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Sales Revenue", 
  "target": 1000000,
  "createdDate": "2023-12-01T10:30:00.000Z",
  "active": true
}
```

## Usage Examples

### Authentication

```typescript
import { hillfogClient } from '@/api/hillfogClient';

// Login
const loginResult = await hillfogClient.login('username', 'password');
if (loginResult.success) {
  console.log('Logged in:', loginResult.user);
}

// Check session
const user = await hillfogClient.getCurrentUser();
if (user) {
  console.log('Current user:', user);
}

// Logout
await hillfogClient.logout();
```

### Working with Scorecards

```typescript
import { hillfogClient } from '@/api/hillfogClient';

// Get all scorecards
const scorecards = await hillfogClient.getScorecards({
  page: 1,
  pageSize: 10,
  searchValue: 'sales'
});

// Get specific scorecard
const scorecard = await hillfogClient.getScorecard('scorecard-id');

// Create new scorecard
const newScorecard = await hillfogClient.createScorecard({
  name: 'Q4 Sales Scorecard',
  content: 'Quarterly sales performance tracking',
  mission: 'Achieve 20% growth in Q4'
});

// Update scorecard
const updated = await hillfogClient.updateScorecard('scorecard-id', {
  name: 'Updated Scorecard Name'
});

// Delete scorecard
const deleted = await hillfogClient.deleteScorecard('scorecard-id');
```

### Working with KPIs

```typescript
import { hillfogClient } from '@/api/hillfogClient';

// Get all KPIs
const kpis = await hillfogClient.getKpis();

// Create new KPI
const newKpi = await hillfogClient.createKpi({
  kpiId: 'SALES_REV_001',
  name: 'Sales Revenue',
  target: 1000000,
  unit: 'USD',
  management: '1', // Higher is better
  dataType: '3'    // Currency
});
```

## Error Handling

The integration layer provides comprehensive error handling:

```typescript
try {
  const scorecards = await hillfogClient.getScorecards();
  // Handle success
} catch (error) {
  console.error('Failed to fetch scorecards:', error);
  // Handle error - could be network, authentication, or server error
}
```

## Backward Compatibility

The enhanced API client maintains full backward compatibility with existing code:

```typescript
// Legacy usage still works
const data = await hillfogClient.get('/some-endpoint');
const result = await hillfogClient.post('/some-endpoint', payload);

// New Hillfog-specific methods are also available
const scorecards = await hillfogClient.getScorecards();
```

## Development Setup

1. **Start Hillfog Backend**
   ```bash
   cd /path/to/hillfog
   java -Xmx512M -jar hillfog-0.4.jar
   ```

2. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with correct backend URL
   ```

3. **Start Next.js Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - UI: http://localhost:3000
   - Backend: http://localhost:8088

## Testing

The integration can be tested by:

1. **Authentication Test**: Login with Hillfog credentials
2. **Data Retrieval**: Fetch scorecards, KPIs, etc.
3. **CRUD Operations**: Create, update, delete entities
4. **Session Management**: Verify session handling

## Deployment Considerations

### Production Deployment

1. **Backend URL**: Update `NEXT_PUBLIC_HILLFOG_BACKEND_URL` for production
2. **CORS Configuration**: Ensure Hillfog backend allows requests from UI domain
3. **Session Configuration**: Configure session timeout and security settings
4. **SSL/TLS**: Use HTTPS for both frontend and backend in production

### Security

- All requests include session cookies for authentication
- CSRF protection is handled by the backend
- Sensitive data is not stored in client-side state
- Session validation occurs on each API request

## Troubleshooting

### Common Issues

1. **CORS Errors**: Configure Hillfog backend to allow requests from UI domain
2. **Session Timeout**: Implement session refresh or redirect to login
3. **Data Format Issues**: Check data transformation utilities
4. **Network Errors**: Verify backend URL and connectivity

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data updates
2. **Offline Support**: Service worker for offline functionality  
3. **Advanced Caching**: Enhanced caching strategies with SWR
4. **Performance Monitoring**: Integration with monitoring tools
5. **API Versioning**: Support for multiple backend API versions

## Support

For issues related to the integration:

1. Check the browser console for error messages
2. Verify backend connectivity and logs
3. Review data transformation for type mismatches
4. Test authentication and session management

The integration layer provides comprehensive logging to help diagnose issues during development and production.