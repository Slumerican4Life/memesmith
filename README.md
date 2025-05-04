
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/14f4e796-1a7e-44a7-838a-33a62074c0d7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/14f4e796-1a7e-44a7-838a-33a62074c0d7) and start prompting.

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

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Serverless Image Processing API

MemeSmith includes a serverless image processing API for generating memes on the server side.

### Local Development

To test the Netlify Functions locally:

1. Install the Netlify CLI:
```sh
npm install -g netlify-cli
```

2. Install function dependencies:
```sh
cd netlify/functions
npm install
cd ../..
```

3. Run the local development server:
```sh
netlify dev
```

### API Usage

The API endpoint is `/api/process-image` and accepts POST requests with multipart form data:

```javascript
// Example of how to use the API
const formData = new FormData();
formData.append('image', imageFile); // File from input[type=file]
formData.append('settings', JSON.stringify({
  texts: [
    {
      content: "Top text",
      x: 540, // center X coordinate
      y: 100, // Y position from top
      fontSize: 60,
      color: "white",
      strokeColor: "black",
      strokeWidth: 2
    },
    {
      content: "Bottom text",
      x: 540,
      y: 1800,
      fontSize: 60
    }
  ]
}));

fetch('/api/process-image', {
  method: 'POST',
  body: formData
})
.then(response => response.blob())
.then(blob => {
  // Use the processed image blob
  const url = URL.createObjectURL(blob);
  image.src = url;
})
.catch(error => console.error('Error:', error));
```

### Deployment

When deployed to Netlify, the API will be available at `https://your-site.netlify.app/api/process-image`.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/14f4e796-1a7e-44a7-838a-33a62074c0d7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
