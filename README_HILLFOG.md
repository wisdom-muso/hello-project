# Hillfog React UI Architecture

A comprehensive React-based UI architecture for strategic performance management with Ant Design integration.

## 🏗️ Project Structure

```
src/
├── api/                     # API layer
│   ├── axiosInstance.ts    # Configured Axios instance with interceptors
│   ├── hillfogClient.ts    # API client wrapper with FormData support
│   └── services/           # API service modules
│       ├── scorecardService.ts
│       └── measureService.ts
├── app/                    # Next.js 15 App Router pages
│   ├── page.tsx           # Dashboard
│   ├── scorecards/        # Scorecard routes
│   │   ├── page.tsx      # List view
│   │   ├── new/page.tsx  # Create form
│   │   └── [id]/edit/page.tsx  # Edit form
│   └── measures/          # Measure data routes
│       └── page.tsx       # Data entry page
├── components/            # Shared components
│   ├── MainLayout.tsx    # Main layout with sidebar & header
│   └── AntdProvider.tsx  # Ant Design configuration
├── features/             # Feature-specific components
│   ├── scorecards/
│   │   ├── ScorecardList.tsx  # Table with search
│   │   └── ScorecardForm.tsx  # Nested form with perspectives/objectives
│   └── measures/
│       └── MeasureDataPage.tsx  # Hybrid HTML rendering
├── hooks/                # Custom React hooks
├── store/                # State management
│   └── useStore.ts      # Zustand store
├── types/                # TypeScript definitions
│   └── index.ts
└── utils/                # Utility functions
    └── helpers.ts
```

## ✨ Key Features

### 1. **MainLayout Component**
- Ant Design Layout with collapsible sidebar
- Navigation menu with routing
- Header with user dropdown menu
- Sticky header with shadow
- Responsive design

### 2. **Scorecard Feature**
- **ScorecardList**: 
  - Ant Design Table with sorting
  - Real-time search filtering
  - Statistics cards
  - CRUD actions (View, Edit, Delete)
  - Pagination
  
- **ScorecardForm**:
  - Nested form structure using Form.List
  - Dynamic perspectives management
  - Nested objectives with Collapse component
  - Add/remove perspectives and objectives
  - Full validation

### 3. **Measure Data Page**
- KPI selector dropdown
- Date picker for data selection
- **Hybrid HTML rendering** with `dangerouslySetInnerHTML`
- **Form interception logic**: Automatically intercepts form submissions within rendered HTML
- FormData serialization for API submission
- Loading and saving states

### 4. **API Layer**
- **axiosInstance.ts**:
  - Custom Axios configuration
  - Request interceptors (auth token injection)
  - Response interceptors (error handling)
  - Automatic 401 redirect
  - Development logging
  
- **hillfogClient.ts**:
  - Generic API wrapper methods (GET, POST, PUT, PATCH, DELETE)
  - **FormData serialization utility**
  - Support for file uploads
  - Nested object/array handling
  - Optional FormData mode

### 5. **State Management**
- Zustand store for global state
- User authentication state
- Sidebar collapse state
- Clean and simple API

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
# or
bun install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NODE_ENV=development
```

### Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Dependencies

- **Next.js 15**: App Router framework
- **React 19**: UI library
- **Ant Design 6.0**: UI component library
- **@ant-design/icons**: Icon library
- **Axios**: HTTP client
- **Zustand**: State management
- **dayjs**: Date manipulation
- **TypeScript**: Type safety

## 🔌 API Integration

### Example: Using the API Client

```typescript
import { hillfogClient } from '@/api/hillfogClient';

// Simple GET request
const scorecards = await hillfogClient.get<Scorecard[]>('/scorecards');

// POST with JSON
const newScorecard = await hillfogClient.post('/scorecards', {
  name: 'Q1 2024',
  description: 'Financial goals'
});

// POST with FormData
const formData = await hillfogClient.post('/measures/data', data, {
  useFormData: true
});

// PUT with FormData
await hillfogClient.put(`/measures/${id}`, data, {
  useFormData: true
});
```

### Example: Using Service Modules

```typescript
import scorecardService from '@/api/services/scorecardService';

// Get all scorecards
const scorecards = await scorecardService.getAll();

// Create new scorecard
const newScorecard = await scorecardService.create({
  name: 'Q1 2024',
  perspectives: [...]
});

// Search scorecards
const results = await scorecardService.search('financial');
```

## 🎨 Customization

### Theme Configuration

Edit `src/components/AntdProvider.tsx` to customize Ant Design theme:

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      fontSize: 14,
    },
  }}
>
```

### API Base URL

Set in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
```

## 📋 Key Implementation Details

### Form Interception (MeasureDataPage)

The MeasureDataPage demonstrates advanced form handling:

1. Server returns HTML with forms
2. React renders HTML using `dangerouslySetInnerHTML`
3. useEffect hook attaches submit listeners to all forms
4. Form submissions are intercepted and prevented
5. FormData is extracted and sent via API
6. Success/error messages displayed
7. Data refreshed after submission

```typescript
useEffect(() => {
  const handleFormSubmit = async (event: Event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    // ... process and submit via API
  };

  const forms = containerRef.current.querySelectorAll('form');
  forms.forEach(form => form.addEventListener('submit', handleFormSubmit));

  return () => {
    forms.forEach(form => form.removeEventListener('submit', handleFormSubmit));
  };
}, [htmlContent]);
```

### Nested Forms (ScorecardForm)

Demonstrates Ant Design's Form.List for complex nested structures:

```typescript
<Form.List name="perspectives">
  {(perspectives, { add, remove }) => (
    <>
      {perspectives.map(perspective => (
        <Form.List name={[perspective.name, 'objectives']}>
          {(objectives, { add, remove }) => (
            // Nested objectives form fields
          )}
        </Form.List>
      ))}
    </>
  )}
</Form.List>
```

## 📝 Type Safety

All API responses and component props are fully typed:

```typescript
interface Scorecard {
  id: string;
  name: string;
  description?: string;
  perspectives: Perspective[];
}

interface Perspective {
  id: string;
  name: string;
  objectives: Objective[];
}
```

## 🛠️ Development

### Adding New Features

1. Create feature component in `src/features/[feature-name]/`
2. Add API service in `src/api/services/`
3. Define types in `src/types/index.ts`
4. Create page route in `src/app/`
5. Update navigation in `MainLayout.tsx`

### Error Handling

Use the utility function for consistent error handling:

```typescript
import { handleApiError } from '@/utils/helpers';

try {
  await api.call();
} catch (error) {
  handleApiError(error); // Shows Ant Design message
}
```

## 📄 License

MIT

---

Built with ❤️ using Next.js 15, React 19, and Ant Design 6.0
