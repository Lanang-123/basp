import "./globals.css";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import Chatbot from "../components/Chatbot/Chatbot.js";

export const metadata = {
  title: "Bali Surya Pratama",
  description:
    "Perusahaan kontraktor yang bergerak dalam bidang pengadaan, engineering, dan pengelolan process limbah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Montserrat:wght@600&display=swap"
          rel="stylesheet"
          precedence="default"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
          precedence="default"
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
