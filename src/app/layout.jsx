import "./globals.css";
import SmoothScrolling from "../components/SmoothScrolling";
import AuthProvider from "../components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <SmoothScrolling />
      <main>{children}</main>
    </AuthProvider>
  );
}

