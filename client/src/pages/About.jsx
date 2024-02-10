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
            <p className="text-base font-semibold text-gray-700 md:text-lg">
              Timur Dian Radha Sejati
            </p>
            <small className="text-gray-500">
              Kreator Platform Sejati Dimedia Blog
            </small>
          </div>
        </div>
        <p className="mb-6 text-base text-gray-700 md:text-lg">
          Selamat datang di{" "}
          <span className="font-bold">Sejati Dimedia Blog</span>,
        </p>
        <p className="mb-6 text-base text-gray-700 md:text-lg">
          Kami yakin bahwa kekuatan kata-kata bukan hanya mampu merubah
          pandangan, tetapi juga membangkitkan semangat, dan menjadi pendorong
          utama dalam menciptakan perubahan yang positif.
        </p>
        <p className="mb-6 text-base text-gray-700 md:text-lg">
          Tujuan kami adalah untuk menjadi sumber yang tepercaya dan bermanfaat
          bagi para pembaca dalam pencarian mereka untuk mendapatkan pengetahuan
          baru, mengeksplorasi ide-ide kreatif, dan menemukan inspirasi di
          setiap sudut halaman.
        </p>
        <p className="mb-6 text-base text-gray-700 md:text-lg">
          Kami berkomitmen untuk menyediakan sumber informasi yang kaya dan
          bermanfaat bagi pembaca kami. Setiap tulisan yang kami publikasikan
          adalah hasil dari dedikasi kami dalam memberikan konten yang mendalam,
          terkini, dan relevan.
        </p>
        <p className="mb-6 text-base text-gray-700 md:text-lg">
          Bergabunglah dengan kami dalam perjalanan membaca yang tak terbatas,
          dan temukan keindahan serta kebenaran di setiap halaman. Kami yakin
          bahwa di <bold className="font-bold">Sejati Dimedia Blog</bold>, Anda
          akan menemukan inspirasi dan wawasan dalam setiap baris kata.
        </p>
      </div>
    </div>
  );
}
