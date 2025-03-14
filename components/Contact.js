"use client"

import {useState,useEffect} from "react"


const Contact = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");
    


    let handleMessageChange = (e) => {
      let inputValue = e.target.value;
      setMessage(inputValue);
    }

    let handleEmailChange = (e) => {
      let inputValue = e.target.value;
      setEmail(inputValue);
    }

    let handleNameChange = (e) => {
      let inputValue = e.target.value;
      setName(inputValue);
    }

    let handleOnSubmit = async (e) => {
      e.preventDefault();
      const result = await fetch("/api/mail",{
        method:"POST",
        body:JSON.stringify({name:name,email:email,message:message})
      })
      if(result.status == 200) {
        console.log("success")
      }else {
        console.log("error")
      }
    }

    return (
      <section className="text-gray-600 body-font relative" id="contact">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
            <iframe width="100%" height="100%" className="absolute inset-0" frameBorder="0" title="map" marginHeight="0" marginWidth="0" scrolling="no" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Kantor%20Notaris/ppat%20ayu%20krishna%20merani+(PT.BALI%20SURYA%20PRATAMA)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">Alamat</h2>
                <p className="mt-1">Jalan Raya Kerobokan, Sawan, Buleleng Bali
                (depan Kuburan Desa Kerobokan,Sawan, Buleleng, Bali)  
                </p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                <a className="text-green-500 leading-relaxed">basp.enviro@gmail.com</a>
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                <p className="leading-relaxed">(0362)27186</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Kontak Kami</h2>
            <p className="leading-relaxed mb-5 text-gray-600">Ajukan pertanyaan,berikan saran dan kritik Anda melalui form dibawah ini !</p>
            <form method="POST" onSubmit={handleOnSubmit}>
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={name} onChange={handleNameChange}/>
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={email} onChange={handleEmailChange}/>
              </div>
              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                <textarea id="message" name="message" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" value={message} onChange={handleMessageChange}></textarea>
              </div>
              <button className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg">Submit</button>
            </form>
          </div>
        </div>
      </section>
    )
}

export default Contact