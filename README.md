# VeritaScribe - AI Document Drafting Demo

A frontend-only interactive demo application for pharmaceutical AI document drafting, designed for public demos and product showcases.

## Features

- **Landing Page**: Professional introduction with problem/solution/impact sections
- **Template Selection**: Choose from IND, NDA, ANDA, DMF, and Photostability templates
- **Data Source Simulation**: Editable table for mock data input
- **AI Drafting**: Animated document filling process
- **Document Preview**: Split-screen view with AI tools panel
- **Advanced Search**: Real-time text highlighting and match counting
- **Edit & Review**: Live document editing with real-time updates
- **Track Changes**: Visual diff showing all document modifications
- **AI Summarization**: Mock AI-powered document summarization
- **Guided Demo Mode**: Toggle for guided demonstrations

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Icons
- React Toastify

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

The application will run on `http://localhost:5173` (or the next available port).

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SearchPanel.tsx
│   ├── EditReviewPanel.tsx
│   ├── TrackChangesPanel.tsx
│   └── SummarizationPanel.tsx
├── context/            # React Context for state management
│   └── DemoContext.tsx
├── data/               # Mock data and templates
│   └── mockTemplates.ts
├── pages/              # Page components
│   ├── Landing.tsx
│   ├── TemplateSelection.tsx
│   ├── DataSourceSimulation.tsx
│   ├── AIDrafting.tsx
│   └── DocumentPreview.tsx
├── App.tsx             # Main app component with routing
└── main.tsx           # Entry point
```

## Demo Flow

1. **Landing Page** (`/`) - Introduction and value proposition
2. **Template Selection** (`/templates`) - Choose a document template
3. **Data Source** (`/data-source`) - Edit mock data fields
4. **AI Drafting** (`/drafting`) - Watch the document being filled
5. **Document Preview** (`/preview`) - Review and edit the completed document

## Key Features

### Mock Data
All data is mocked in the frontend. No backend or API calls are made.

### Interactive Elements
- Smooth animations and transitions
- Real-time document updates
- Visual highlighting for filled fields
- Search with match counting
- Change tracking with visual diff

### Responsive Design
Fully responsive layout that works on desktop, tablet, and mobile devices.

## Notes

This is a **demo application** for showcasing purposes. All data is simulated and no actual document processing occurs.
