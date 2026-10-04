import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import MainContainer from "./MainContainer";

const AboutPage = () => {
  return (
    <MainContainer>
<div className="mx-auto max-w-4xl px-4 py-8 leading-relaxed">
<h1 className="sr-only">About AlfathChat</h1>

    <img
      className="pointer-events-none mx-auto mb-6 w-full max-w-xs select-none"
      src="/images/convayto-logo.png"
      alt="AlfathChat"
    />

    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold">Project Overview</h2>
      <p>
        AlfathChat is a real-time chat application built with
        React.js and Supabase. It provides a platform for
        communication with a responsive interface and real-time
        messaging features.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold">Goals</h2>
      <ul className="list-disc pl-5">
        <li>
          Provide a convenient platform for real-time communication.
        </li>
        <li>
          Support real-time messaging and synchronization.
        </li>
        <li>
          Provide a responsive interface for different devices.
        </li>
        <li>
          Continue improving the AlfathChat user experience.
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold">Developer</h2>

      <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row">
        <img
          src="https://logo-alfsth.vercel.app/IMG-20261004-WA0399.jpg"
          alt="Alfath Nurrahman"
          className="h-36 w-36 rounded-md"
        />

        <div>
          <p className="mb-2">
            AlfathChat is developed and maintained by{" "}
            <strong className="text-bgAccent dark:text-textAccent-dark">
              Alfath Nurrahman
            </strong>
            . Connect with me through WhatsApp Channel,
            Instagram, WhatsApp, and TikTok.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-textAccent dark:text-textAccent-dark">
        <a
          href="https://whatsapp.com/channel/0029VbFXLg96LwHhyiQxLy1a"
          className="flex items-center hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="mr-2" /> Saluran WhatsApp
        </a>

        <a
          href="https://www.instagram.com/fathemjota?stkn=ejZ5aG9md2xrc2Zo"
          className="flex items-center hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="mr-2" /> Instagram
        </a>

        <a
          href="https://wa.me/62895321551449"
          className="flex items-center hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="mr-2" /> WhatsApp
        </a>

        <a
          href="https://www.tiktok.com/@donway.id"
          className="flex items-center hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok className="mr-2" /> TikTok
        </a>
      </div>
    </section>

    <section className="mt-8 grid grid-cols-1 grid-rows-2 gap-2 sm:grid-cols-2 sm:grid-rows-1">
      <a
        href="https://whatsapp.com/channel/0029VbFXLg96LwHhyiQxLy1a"
        className="flex items-center justify-center rounded-lg bg-gray-800 px-6 py-3 text-white hover:bg-gray-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Saluran WhatsApp</span>
        <FaWhatsapp className="ml-2" />
      </a>

      <a
        href="https://www.instagram.com/fathemjota?stkn=ejZ5aG9md2xrc2Zo"
        className="flex items-center justify-center rounded-lg bg-textAccent px-6 py-3 text-white hover:bg-textAccentDim dark:bg-textAccentDim dark:hover:bg-textAccentDim-dark"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Instagram</span>
        <FaInstagram className="ml-2" />
      </a>
    </section>

    <footer className="mt-6 text-center text-sm opacity-70">
      <p>
        © Copyright by{" "}
        <a
          href="https://www.instagram.com/fathemjota?stkn=ejZ5aG9md2xrc2Zo"
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alfath Nurrahman
        </a>
        . All rights reserved.
      </p>
    </footer>
  </div>
</MainContainer>
    
  );
};

export default AboutPage;
