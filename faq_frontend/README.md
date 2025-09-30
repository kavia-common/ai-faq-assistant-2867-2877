# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

If you are running inside a container or a cloud preview environment with a non-localhost domain, see the "Invalid host header" section below.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Handling "Invalid host header" / "Invalid host" errors

When running Create React App in some containerized or preview environments, the dev server may reject requests from non-localhost hostnames.

Recommended options (choose one):

1) Preferred: set HOST and PUBLIC_URL in .env  
- Copy `.env.example` to `.env` and set:
  - `HOST` to the preview domain (without protocol), e.g. `HOST=vscode-internal-41321-beta.beta01.cloud.kavia.ai`
  - Optionally `PUBLIC_URL` to include protocol and port, e.g. `PUBLIC_URL=https://vscode-internal-41321-beta.beta01.cloud.kavia.ai:3000`
- Then run:
  - `npm start`

2) Fallback (less secure, but effective in trusted preview environments):  
- Use the provided script to disable host checks:
  - `npm run start:insecure`

Notes:
- If you cannot predetermine the preview hostname, use `start:insecure` temporarily.
- For production builds, this setting is not used.

## Backend API URL

The app defaults to same-origin for API calls (or CRA proxy if configured). To target a different backend:
- Set `REACT_APP_BACKEND_URL` in `.env` to your backend base URL (no trailing slash).
- Example: `REACT_APP_BACKEND_URL=https://api.example.com`

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
