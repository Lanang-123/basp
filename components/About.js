"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
  const slogan = "We Care We Share";

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      y: -5,
      opacity: 1,
    },
  };

  const slideRight = {
    hidden: {
      x: 300,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  const slideUp = {
    hidden: {
      y: 500,
      opacity: 0,
    },
    visible: {
      y: 10,
      opacity: 1,
    },
  };

  return (
    <section className="text-gray-600 body-font" id="about">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <motion.div
          className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
        >
          <Image
            className="object-cover object-center rounded"
            alt="hero"
            src="/assets/img/about.jpg"
            width={720}
            height={600}
          />
        </motion.div>
        <motion.div
          className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mt-16 md:mb-0 items-center text-center md:ml-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.5 }}
        >
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-green-600">
            Tentang Kami
            <br className="hidden lg:inline-block" />
          </h1>
          <p className="mb-8 leading-relaxed">
            PT.Bali Surya Pratama terbentuk pada tahun 2019, berlokasi di Buleleng-Bali.
            PT Bali Surya Pratama memiliki tujuan untuk melestarikan lingkungan dengan cara
            pengolahan limbah industri.
          </p>
        </motion.div>
      </div>

      {/* Visi dan Misi */}
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <h1 className="mb-4 text-5xl text-green-600 font-semibold underline">
          Visi
        </h1>
        <div className="flex flex-wrap w-full">
          <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
            <motion.div
              className="flex relative pb-12"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.2 }}
            >
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5DF99] inline-flex items-center justify-center text-slate-800 relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
              </div>

              <div className="flex-grow pl-4">
                <p className="leading-relaxed">
                  Menjadikan PT. BASP sebagai keyplayer dalam menjaga dan melestarikan
                  Lingkungan di daerah sendiri (Buleleng, Bali, Indonesia)
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex relative pb-12"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.3 }}
            >
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5DF99] inline-flex items-center justify-center text-slate-800 relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="5" r="3"></circle>
                  <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                </svg>
              </div>

              <div className="flex-grow pl-4">
                <p className="leading-relaxed">
                  Menjadikan PT. BASP sebagai salah satu refferensi atau raw model dalam
                  menjaga dan melestarikan lingkungan
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex relative pb-12"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.4 }}
            >
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5DF99] inline-flex items-center justify-center text-slate-800 relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>

              <div className="flex-grow pl-4">
                <p className="leading-relaxed">
                  PT. BASP selalu berkomitmen dalam berbagi berbagai hal design, konsep, serta
                  idea idea kreatif untuk menunjang pengelolaan dan pelestarian lingkungan sesuai
                  dengan motto {slogan}
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex relative"
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5DF99] inline-flex items-center justify-center text-slate-900 relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <p className="leading-relaxed">
                  PT. BASP merupakan rumah yang nyaman bagi semua stakeholdernya.
                </p>
              </div>
            </motion.div>
          </div>
          <Image
            className="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12"
            src="/assets/img/misi.jpg"
            alt="step"
            width={650}
            height={500}
          />
        </div>

        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <h1 className="mb-4 text-5xl text-green-600 font-semibold underline">
            Misi
          </h1>
          <div className="flex flex-wrap w-full">
            <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6 mb-10">
              <motion.div
                className="flex relative pb-12"
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.2 }}
              >
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5DF99] inline-flex items-center justify-center text-slate-800 relative z-10">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                </div>

                <div className="flex-grow pl-4">
                  <p className="leading-relaxed">
                    Memberikan penyuluhan dan sharing knowledge mengenai basic product PT. BASP ke market (melalu lembaga pemerintahan, rumah sakit, etc)
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex relative pb-12"
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.3 }}
              >
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5DF99] inline-flex items-center justify-center text-slate-800 relative z-10">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="5" r="3"></circle>
                    <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                  </svg>
                </div>

                <div className="flex-grow pl-4">
                  <p className="leading-relaxed">
                    Membuat product yang mampu memberikan benefit yang lebih berdampak kepada pemakai dalam mencapai tujuan usaha dari kacamata Quality, Cost, Productivity dan Competitiveness
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex relative pb-12"
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.4 }}
              >
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5DF99] inline-flex items-center justify-center text-slate-800 relative z-10">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>

                <div className="flex-grow pl-4">
                  <p className="leading-relaxed">
                    Menyiapkan sarana bagi semua pekerja untuk meningkatkan performa dan kemampuannya dalam rangka pengembangan diri, dan kompetensi
                  </p>
                </div>
              </motion.div>
            </div>
            <Image
              className="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12"
              src="/assets/img/visi.jpg"
              alt="step"
              width={650}
              height={500}
            />
          </div>
        </div>
        </div>
      </section>
    );
};

export default About;
