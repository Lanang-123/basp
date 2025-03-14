"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const fadeUp = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div>
      <div className="relative h-screen w-full flex items-center justify-start text-left bg-cover bg-center bg-[url('/assets/img/heronew.jpg')]">
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-green-800 opacity-70"></div>

        <main className="px-10 lg:px-24 z-10 flex justify-center items-center w-full relative flex-col -mt-10">
          <div className="text-center">
            <h2 className="text-5xl tracking-tight leading-12 md:leading-12 font-extrabold sm:text-5xl text-lime-300 sm:leading-none md:text-7xl my-5 md:my-12 font-kaushan capitalize-first">
              We Care We Share
            </h2>
            <motion.h2
              className="text-xl tracking-tight leading-10 py-5 font-extrabold sm:text-5xl text-white sm:leading-none md:text-2xl sm:py-5 font-montserrat md:-mt-10"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.5 }}
            >
              Bali Surya Pratama
            </motion.h2>
          </div>
          {/* Jika menggunakan Next.js 13 dan ingin tetap menggunakan <a>, tambahkan legacyBehavior */}
          <Link href="/#produk" legacyBehavior>
            <a className="md:w-full px-4 py-2 mt-10 text-sm text-center font-medium text-white uppercase transition-colors duration-200 transform bg-green-600 rounded-md lg:w-auto hover:bg-green-700 focus:outline-none">
              Produk
            </a>
          </Link>
        </main>
      </div>
    </div>
  );
}
