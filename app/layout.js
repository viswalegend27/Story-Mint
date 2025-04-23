import '../styles/globals.css'
import NavWrapper from '../components/NavWrapper';

export const metadata = {
  title: 'StoryMint',
  description: 'Creative writing platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="font-sans bg-gray-50">
        <NavWrapper />
        <main className="min-h-screen px-4">{children}</main>
      </body>
    </html>
  );
}
