"use client";

import React, { useState } from "react";
import Image from "next/image";

const Galery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const dataFoto = [
    { id: 1, foto: "/assets/galery/psa/psa1.jpg" },
    { id: 2, foto: "/assets/galery/psa/psa2.jpg" },
    { id: 3, foto: "/assets/galery/psa/psa4.jpg" },
    { id: 5, foto: "/assets/galery/psa/psa5.jpg" },
    { id: 6, foto: "/assets/galery/psa/psa6.jpeg" },
    { id: 7, foto: "/assets/galery/psa/psa7.jpeg" },
    { id: 8, foto: "/assets/galery/psa/psa8.jpeg" },
    { id: 9, foto: "/assets/galery/ss/ss1.jpg" },
    { id: 10, foto: "/assets/galery/ss/ss2.jpg" },
    { id: 11, foto: "/assets/galery/ss/ss3.jpg" },
    { id: 12, foto: "/assets/galery/ss/ss4.jpg" },
    { id: 13, foto: "/assets/galery/ss/ss5.jpg" },
    { id: 14, foto: "/assets/galery/ss/ss6.jpg" },
    { id: 15, foto: "/assets/galery/ss/ss7.jpeg" },
    { id: 16, foto: "/assets/galery/ss/ss8.jpg" },
    { id: 17, foto: "/assets/galery/ss/ss9.jpg" },
    { id: 18, foto: "/assets/galery/ss/ss10.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-gray-800 md:text-5xl text-3xl font-bold mb-6">
          Gallery Bali Surya Pratama
        </h1>
        <p className="text-gray-600 text-lg">Kenangan terbaik dalam satu frame</p>
      </div>

      {/* Gallery Grid */}
      <div className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto justify-center my-8 p-5">
        {dataFoto.map((data) => (
          <div
            key={data.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            onClick={() => setSelectedImage(data.foto)}
          >
            <Image
              src={data.foto}
              alt="Galeri"
              width={400}
              height={250}
              className="w-full h-48 object-cover rounded-lg"
            />
            {/* Overlay efek hover */}
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Modal untuk zoom gambar */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Preview"
              width={800}
              height={500}
              className="max-w-full max-h-[80vh] rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-800 shadow-lg hover:bg-gray-200 transition"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galery;
