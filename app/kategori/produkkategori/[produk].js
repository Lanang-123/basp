import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {useEffect} from "react"

  const dataProduk = [
    {
      id: 1,
      title: "Filter Tank",
      desc: "data sedang diupdate",
      img: {
        produk: "../assets/img/produk1.jpg",
        bahanBaku: "",
      },
    },
    {
      id: 2,
      title: "Compact Refining System",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      img: {
        produk: "../assets/img/produk2.jpg",
        bahanBaku: "",
      },
    },
    {
      id: 3,
      title: "Fume Scrubber",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      img: {
        produk: "../assets/img/produk3.jpg",
        bahanBaku: "",
      },
    },
    {
      id: 4,
      title: "Chemical Refinery",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
      img: {
        produk: "../assets/img/produk4.jpg",
        bahanBaku: "",
      },
    },
    {
      id: 5,
      title: "BASP Enviro Microorganisme",
      desc: "Kumpulan bermacam microorganisme yang sangat berguna dalam mengurai senyawa organic pada air limbah. Dengan metode dan komposisi yang tepat mampu menurunkan nilai BOD dan COD sesuai nilai baku mutu yang diijinkan",
      img: {
        produk: "../assets/img/produk5.jpg",
        bahanBaku: "",
      },
    },
    {
      id: 6,
      title: "BASP Consmable Media",
      desc: "Merupakan nutrisi yang terbuat dari bahan organik. Sangat dibutuhkan oleh microorganisme untuk tumbuh dan beradaptasi dilingkungan yang baru",
      img: {
        produk: "../assets/img/produk6.jpg",
        bahanBaku: "",
      },
    },
  ];


const ProductId = ({dataId}) => {
  const router = useRouter(); 
  const { produk } = router.query;
  console.log(dataId)
  

  return (
    <>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-teal-accent-400">
              <svg className="text-teal-900 w-7 h-7" viewBox="0 0 24 24">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  points=" 8,5 8,1 16,1 16,5"
                  strokeLinejoin="round"
                />
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  points="9,15 1,15 1,5 23,5 23,15 15,15"
                  strokeLinejoin="round"
                />
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  points="22,18 22,23 2,23 2,18"
                  strokeLinejoin="round"
                />
                <rect
                  x="9"
                  y="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  width="6"
                  height="4"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="max-w-xl mb-6">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                {dataId.title}
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                {dataId.desc}
              </p>
            </div>
            <div>
              <Link href="/Galery">
              <a
                aria-label=""
                className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
              >
                Learn more
                <svg
                  className="inline-block w-3 ml-2"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                </svg>
              </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center -mx-4 lg:pl-8">
            <div className="flex flex-col items-end px-3 gap-2">
              <Image
                className="object-cover mb-6 rounded shadow-lg h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56"
                src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                alt=""
                width={300}
                height={300}
              />
              <Image
                className="object-cover w-20 h-20 rounded shadow-lg sm:h-32 xl:h-40 sm:w-32 xl:w-40"
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
                alt=""
                width={150}
                height={150}
              />
            </div>
            <div className="px-3">
              <Image
                className="object-cover w-40 h-40 rounded shadow-lg sm:h-64 xl:h-80 sm:w-64 xl:w-80"
                src="https://images.pexels.com/photos/3182739/pexels-photo-3182739.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;w=500"
                alt=""
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const paths = dataProduk.map((post) => ({
    params: { produk: post.title.toString() },
  }))
  return {
    paths,
    fallback:false
  }
}

export async function getStaticProps({params={}}) {
  const dataId = dataProduk.find((data) => data.title === params.produk);
  return {
    props:{
      dataId
    }
  }

}

export default ProductId;
