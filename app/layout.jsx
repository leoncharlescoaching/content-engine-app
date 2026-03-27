
export const metadata = {
  title: "Content Engine",
  description: "Leon Charles Content Engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
