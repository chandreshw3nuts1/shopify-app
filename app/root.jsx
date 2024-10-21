import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import '@shopify/polaris-tokens/css/styles.css';
import settings from './utils/settings.json'; 

import './i18n';
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link rel="icon" href="/images/favicon.png" type="image/x-icon" />

        <link rel="stylesheet" href={`${settings.host_url}/fonts/icon24.css`} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={`${settings.host_url}/styles/global.css`} />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        
        <Meta />
        <Links />
      </head>
      <body style={{ backgroundColor: 'var(--p-color-bg-fill-hover)'}}>
        <div className="main_layout">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}
