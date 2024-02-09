import { images } from "../constants";

export default function About() {
  return (
    <div className="min-h-screen py-8 ">
      <div className="max-w-3xl px-4 mx-auto">
        <div className="flex items-center mb-8">
          <img
            src={images.Profile}
            alt="Profile"
            className="object-cover w-16 h-16 mr-4 rounded-full"
          />
          <div>
            <p className="text-lg font-semibold text-gray-700">
              Timur Dian Radha Sejati
            </p>
            <small>Pemilik Sejati Dimedia Blog</small>
          </div>
        </div>
        <p className="mb-8 text-lg text-gray-700">
          Selamat datang di Sejati Dimedia Blog,
        </p>
        <p className="mb-8 text-lg text-gray-700">
          Kami percaya bahwa kekuatan sebuah kata dapat mengubah pandangan,
          membangkitkan semangat, dan membawa perubahan. Oleh karena itu, kami
          berkomitmen untuk menyajikan konten yang menarik, menggugah, dan
          memperkaya pengetahuan Anda.
        </p>
        <p className="mb-8 text-lg text-gray-700">
          Tujuan kami adalah untuk menjadi sumber yang tepercaya dan bermanfaat
          bagi para pembaca dalam pencarian mereka untuk mendapatkan pengetahuan
          baru, mengeksplorasi ide-ide kreatif, dan menemukan inspirasi di
          setiap sudut halaman. Kami berkomitmen untuk menyajikan berita
          terkini, ulasan mendalam, cerita inspiratif, serta panduan praktis
          yang relevan dengan cara yang informatif dan menghibur.
        </p>
        <p className="mb-8 text-lg text-gray-700">
          Bergabunglah dengan kami dalam perjalanan membaca yang tak terbatas,
          dan temukan keindahan serta kebenaran di setiap halaman. Kami yakin
          bahwa di Sejati Dimedia Blog, Anda akan menemukan inspirasi dan
          wawasan dalam setiap baris kata.
        </p>
      </div>
    </div>
  );
}
