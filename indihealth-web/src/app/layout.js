// src/app/layout.js
import './globals.css';
import Sidebar from './Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <div className="flex">
          <Sidebar />
          <main className="ml-64 flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
