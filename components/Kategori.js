import Link from "next/link"
import Image from "next/image"
import { FaTint, FaWind, FaServer } from "react-icons/fa";




export default function Kategori() {

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

    const dataKategori = [
      {
        id: 1,
        namaKategori: "Pengolahan Air",
        img: "/assets/kategori/air.png",
      },
      {
        id: 2,
        namaKategori: "Pengolahan Udara",
        img: "/assets/kategori/udara.jpg",
      },
      {
        id: 3,
        namaKategori: "Fabrikasi Mesin",
        img: "/assets/kategori/mesin.jpg",
      },
    ];

    
    return (
      <section
        className="mx-auto px-4 w-full mt-0 py-10 lg:px-8 bg-green-200"
        id="produk"
      >
        <div className="text-center">
          <h1 className="text-5xl text-slate-800 font-medium">Produk</h1>
          <p className="mt-3 text-green-500">
            Beberapa produk yang kami tawarkan untuk Anda.
          </p>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto justify-center">
          {dataKategori.map((items, key) => (
            <article
              className="max-w-md mx-auto mt-4 shadow-lg rounded-2xl p-7 duration-300 hover:shadow-sm bg-white"
              key={items.id}
            >
              <Link href={`/kategori/${items.namaKategori}`}>
                <div>
                  <Image
                    src={items.img}
                    loading="lazy"
                    alt={items.namaKategori}
                    className="w-full h-48 rounded-t-md object-cover object-center rounded-md"
                    width={600}
                    height={400}
                  />
                  <div className="flex items-center mt-2 pt-3 ml-4 mr-2"></div>
                  <div className="pt-3 ml-4 mr-2 mb-3 flex justify-start items-center">
                    {items.id == "1" && (
                      <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full border border-1 border-green-800 text-green-800 flex-shrink-0 text-xl">
                        <FaTint />
                      </div>
                    )}
                    {items.id == "2" && (
                      <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full border border-1 border-green-800 text-green-800 flex-shrink-0 text-xl">
                        <FaWind />
                      </div>
                    )}
                    {items.id == "3" && (
                      <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full border border-1 border-green-800 text-green-800 flex-shrink-0 text-xl">
                        <FaServer />
                      </div>
                    )}

                    <h3 className="text-2xl text-green-900 text-center font-semibold">
                      {items.namaKategori}
                    </h3>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    );
}
