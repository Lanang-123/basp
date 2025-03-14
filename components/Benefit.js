import {MdEmojiPeople} from "react-icons/md"
import {GiProgression} from "react-icons/gi"
import {FiSettings} from "react-icons/fi"

const Benefit = () => {
    return (
      <section className="text-gray-600 body-font relative bg-green-200">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-md text-green-500 tracking-widest font-medium title-font mb-1 ">
              BENEFIT
            </h2>
            <h1 className="sm:text-5xl text-2xl font-medium title-font text-slate-800">
              Mengapa memilih BSP ?
            </h1>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3 w-full group">
              <div className="flex rounded-lg h-full   group-hover:bg-green-500 group-hover:text-white bg-white shadow-lg p-8 flex-col">
                <div className="flex items-center mb-3 mx-auto ">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full group-hover:bg-white  group-hover:text-green-500 bg-green-500 text-white flex-shrink-0 ">
                    <MdEmojiPeople className="w-8 h-8"/>
                  </div>
                  <h2 className="text-gray-900 text-2xl title-font font-medium group-hover:text-white">
                    Experience
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/3 group w-full">
              <div className="flex rounded-lg h-full  group-hover:bg-green-500 group-hover:text-white bg-white shadow-lg p-8 flex-col">
                <div className="flex items-center mb-3 mx-auto">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full group-hover:bg-white group-hover:text-green-500 bg-green-500 text-white flex-shrink-0">
                    <FiSettings className="w-8 h-8"/>
                  </div>
                  <h2 className="text-gray-900 text-2xl title-font font-medium group-hover:text-white">
                    Development
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/3 group w-full">
              <div className="flex rounded-lg h-full  group-hover:bg-green-500 group-hover:text-white bg-white shadow-lg p-8 flex-col">
                <div className="flex items-center mb-3 mx-auto">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full group-hover:bg-white group-hover:text-green-500 bg-green-500 text-white flex-shrink-0">
                    <GiProgression className="w-8 h-8"/>
                  </div>
                  <h2 className="text-gray-900 text-2xl title-font font-medium group-hover:text-white">
                    Sustain Ability
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default Benefit