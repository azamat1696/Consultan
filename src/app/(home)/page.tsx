import Slider from "@/components/Slider";
import PopularCategories from "@/components/PopularCategories";
import PopularConsultants from "@/components/PopularConsultants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChalkboardTeacher,
    faLocation,
    faVideoCamera
} from "@fortawesome/free-solid-svg-icons";
import {faCheckCircle, faComment, faCreditCard} from "@fortawesome/free-regular-svg-icons";

export default async function Home() {
  return (
      <>
          <Slider/>
          <div style={{backgroundColor: "#857b9e"}}
               className="px-5 py-8 flex justify-center items-center">
              <div className="items-center">
                  <h1 className="text-2xl font-bold w-full text-white">Online Psikolog, Aile Danışmanı, Çocuk Gelişim, Astrolog ve
                      Daha Fazlası <span className="text-white font-bold text-3xl">Dancomy`da!</span></h1>
                  {/* descriptiom */}
                  <p className="text-lg w-full flex justify-center items-center mt-3 text-white">Online Psikolog, Aile Danışmanı,
                      Pedagog ve Diyetisyen</p>
              </div>
          </div>
          <PopularCategories/>
          <PopularConsultants />
          {/*<div className="mx-5 py-16 px-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative">
                      <div className="absolute bg-blue-100 rounded-full w-64 h-64 -z-10 -left-10 -top-10"></div>
                      <img src="/assets/images/how-is-working-advicemy-3.png" alt="Laptop and Phone Mockup"
                           className="rounded-lg"/>
                  </div>
                  <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                          <FontAwesomeIcon icon={faLocation} color="red" className="h-6 w-6 mr-2"/>
                          Lokasyondan Bağımsız
                      </h3>
                      <p className="text-gray-600 text-base">Evinizde, iş yerinizde, size en uygun ortamda uzman
                          danışmanlarımızdan birini seçin.</p>
                  </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
                  <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                          <FontAwesomeIcon icon={faChalkboardTeacher} color="red" className="h-6 w-6 mr-2"/>
                          Ön Görüşme Veya Mesaj
                      </h3>
                      <p className="text-gray-600 text-base">Ücretsiz ön görüşme ile danışman ile tanışabilirsiniz veya
                          mesaj atarak soru sorabilirsiniz.</p>
                  </div>
                  <div className="relative">
                      <div className="absolute bg-blue-100 rounded-full w-64 h-64 -z-10 -right-10 -top-10"></div>
                      <img src="/assets/images/how-is-working-advicemy-2.png" alt="Laptop and Phone Mockup"
                           className="rounded-lg"/>
                  </div>
              </div>
          </div> */}
          <div className="bg-gray-50">
              <div className="py-16">
                  <div className="container mx-auto text-center">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                          Size Sunduğumuz <span className="text-gray-800">Avantajlar...</span>
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
                          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                              <div className="flex justify-center items-center mb-4">
                                  <div className="bg-[#35303E] rounded-full p-3 text-center">
                                      <FontAwesomeIcon icon={faVideoCamera} color="white" height={45} width={30}
                                                       size="2xl"/>
                                  </div>
                              </div>
                              <h3 className="font-semibold text-gray-800 text-lg mb-2">Birebir Canlı Görüşme</h3>
                              <p className="text-gray-600 text-sm">
                                  Evinizde, işyerinde ya da bulunduğunuz her yerden canlı görüş.
                              </p>
                          </div>

                          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                              <div className="flex justify-center items-center mb-4">
                                  <div className="bg-[#35303E] rounded-full p-3 text-center">
                                      <FontAwesomeIcon icon={faComment} color="white" height={45} width={30}
                                                       size="2xl"/>
                                  </div>
                              </div>
                              <h3 className="font-semibold text-gray-800 text-lg mb-2">Online Görüş</h3>
                              <p className="text-gray-600 text-sm">
                                  Mesaj atarak soru sorabilirsiniz.
                              </p>
                          </div>


                          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                              <div className="flex justify-center items-center mb-4">
                                  <div className="bg-[#35303E] rounded-full p-3 text-center">
                                      <FontAwesomeIcon icon={faCreditCard} color="white" height={45} width={30}
                                                       size="2xl"/>
                                  </div>
                              </div>
                              <h3 className="font-semibold text-gray-800 text-lg mb-2">Kredi Kartı ile Ödeme</h3>
                              <p className="text-gray-600 text-sm">
                                  Kredi kartınız ile güvenli ödeme yapabilirsiniz.
                              </p>
                          </div>

                          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                              <div className="flex justify-center items-center mb-4">
                                  <div className="bg-[#35303E] rounded-full p-3 text-center">
                                      <FontAwesomeIcon icon={faCheckCircle} color="white" height={45} width={30}
                                                       size="2xl"/>
                                  </div>
                              </div>
                              <h3 className="font-semibold text-gray-800 text-lg mb-2">100% İade Güvencesi</h3>
                              <p className="text-gray-600 text-sm">
                                  Memnun kalmadığınızda paranız iade.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </>
  );
}
