import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const dataProduk = [
    {
      id: 1,
      title: "Filter Tank",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      img: "/assets/img/produk1.jpg",
    },
    {
      id: 2,
      title: "Compact Refining System",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      img: "/assets/img/produk2.jpg",
    },
    {
      id: 3,
      title: "Fume Scrubber",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      img: "/assets/img/produk3.jpg",
    },
    {
      id: 4,
      title: "Chemical Refinery",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      img: "/assets/img/produk4.jpg",
    },
    {
      id: 5,
      title: "BASP Enviro Microorganisme",
      desc: "Kumpulan bermacam microorganisme yang sangat berguna dalam mengurai senyawa organic pada air limbah. Dengan metode dan komposisi yang tepat mampu menurunkan nilai BOD dan COD sesuai nilai baku mutu yang diijinkan",
      img: "/assets/img/produk5.jpg",
    },
    {
      id: 6,
      title: "BASP Consmable Media",
      desc: "Merupakan nutrisi yang terbuat dari bahan organik. Sangat dibutuhkan oleh microorganisme untuk tumbuh dan beradaptasi dilingkungan yang baru",
      img: "/assets/img/produk6.jpg",
    },
  ];

  return (
    <footer className="text-gray-600 body-font bg-green-200 mt-22">
      <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <Image
              src="/assets/img/logo.png"
              width={120}
              height={100}
              alt="Logo BSP"
            />
            <span className="ml-3 text-xl">PT. BALI SURYA PRATAMA</span>
          </a>
          <p className="mt-2 text-sm text-gray-500 text-center">
            We Care We Share
          </p>
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              MENU
            </h2>
            <nav className="list-none mb-10">
              <li>
                <Link href="/">
                  <p className="text-gray-600 hover:text-gray-800">Home</p>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <p className="text-gray-600 hover:text-gray-800">About</p>
                </Link>
              </li>
              <li>
                <Link href="/#produk">
                  <p className="text-gray-600 hover:text-gray-800">Produk</p>
                </Link>
              </li>
              <li>
                <Link href="/#contact">
                  <p className="text-gray-600 hover:text-gray-800">Contact</p>
                </Link>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              PRODUK
            </h2>
            <nav className="list-none mb-10">
              {dataProduk.map((items) => (
                <li key={items.id}>
                  <Link href={`/${items.title}`}>
                    <p className="text-gray-600 hover:text-gray-800">
                      {items.title}
                    </p>
                  </Link>
                </li>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-[#F5DF99]">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © 2022 Copyright -
            <a
              href="https://twitter.com/knyttneve"
              rel="noopener noreferrer"
              className="text-gray-600 ml-1"
              target="_blank"
            >
              @BSP
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start ">
            <a className="text-gray-500">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                ></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
