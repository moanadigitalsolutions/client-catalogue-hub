# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/bcf2f7b7-5a83-4108-b76d-6001a1f9c58c

## Deployment Instructions

### Prerequisites

1. Node.js version 18 or higher
2. npm (Node Package Manager)
3. Git

### Environment Setup

The following environment variables need to be configured:

```
VITE_SUPABASE_URL=https://ffamaeearrzchaxuamcl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmYW1hZWVhcnJ6Y2hheHVhbWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzc3NTUsImV4cCI6MjA1MTkxMzc1NX0.BlU9-Xq9H-Z5eQ36XELQSryEeb1WQxeEui3pJrwLeiQ
```

### Deployment Steps

1. **Clone the Repository**
```sh
git clone <repository-url>
cd <project-directory>
```

2. **Install Dependencies**
```sh
npm install
```

3. **Build the Project**
```sh
npm run build
```
This will create a `dist` directory with the production build.

4. **Serve the Build**
The `dist` directory contains static files that can be served by any web server.

### Platform-Specific Instructions

#### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

#### Vercel
1. Import your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard
6. Deploy

#### AWS S3 + CloudFront
1. Create an S3 bucket
2. Enable static website hosting
3. Upload the contents of `dist` directory
4. Configure CloudFront distribution
5. Point your domain to CloudFront

### Post-Deployment Checklist

1. Verify all environment variables are set correctly
2. Test authentication flows
3. Confirm file uploads are working
4. Check all API endpoints are accessible
5. Verify SSL/HTTPS is properly configured
6. Test user roles and permissions

### Troubleshooting

Common issues and solutions:

1. **404 errors on refresh**: Add proper redirect rules
   - For Netlify: Add `_redirects` file in public directory with:
     ```
     /* /index.html 200
     ```
   - For Vercel: Add `vercel.json` with:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```

2. **CORS issues**: Verify Supabase project settings
3. **Authentication errors**: Check environment variables

For additional support, contact the development team.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bcf2f7b7-5a83-4108-b76d-6001a1f9c58c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bcf2f7b7-5a83-4108-b76d-6001a1f9c58c) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)