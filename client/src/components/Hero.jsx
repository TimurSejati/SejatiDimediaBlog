import { FiSearch } from "react-icons/fi";
import { images } from "../constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const { posts } = useSelector((state) => state.posts);

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    const filteredPost =
      posts &&
      posts.filter((post) =>
        post.title.toLowerCase().includes(value.toLowerCase())
      );
    setSearchData(filteredPost);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <section className="flex flex-col items-center justify-center px-5 py-5 lg:flex-row">
      <div className="mt-10 lg:w-2/3">
        <h1 className="text-xl font-bold text-center font-roboto text-dark-soft md:text-5xl lg:text-4xl xl:text-3xl">
          Temukan inspirasi dan wawasan dalam setiap baris kata.
        </h1>
        <p className="mt-4 text-center text-dark-light lg:text-base xl:text-xl md:text-xl">
          Tempat di mana setiap baris kata adalah jendela menuju inspirasi dan
          wawasan yang mendalam, membuka pintu menuju pengetahuan yang tak
          terbatas.
        </p>
        {/* SearchInput */}
        <div className="flex flex-col gap-y-2.5 mt-10 relative xl:mt-10">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[#959EAD]" />
            <input
              className="placeholder:font-bold font-semibold text-dark-soft placeholder:text-[#959EAD] rounded-lg pl-12 pr-3 w-full py-3 focus:outline-none shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] md:py-4 border-none"
              placeholder="Temukan artikel"
              type="text"
              onChange={(e) => handleSearchChange(e.target.value)}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Searchbox */}
            <div className="absolute z-[999] w-full rounded-lg bg-[#fff] shadow-lg">
              {searchTerm &&
                searchData &&
                searchData.map((post, index) => {
                  const d = post.title;
                  const title = d.replace(/\s+/g, "-");

                  return (
                    <div
                      key={index}
                      className="flex items-center h-[70px] shadow-sm"
                    >
                      <div>
                        <Link to={`/blog/${post.slug}`}>
                          <div className="flex items-center m-1.5">
                            <img
                              src={post.photo}
                              alt={post.title}
                              className="w-[60px] h-[60px] mr-[10px] rounded-md"
                            />
                            <div>
                              <div className="truncate text-ellipsis w-[240px] sm:w-full">
                                {title}
                              </div>
                              {post?.categories.map((category) => (
                                <span
                                  className="px-2 py-1 mr-2 text-xs rounded-md text-primary bg-primary bg-opacity-10"
                                  key={category._id}
                                >
                                  {category.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="w-full px-5 py-3 font-semibold text-white transition duration-75 rounded-lg bg-primary md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 md:w-fit md:py-2 ext-primary hover:bg-blue-500"
          >
            Cari
          </button>
          {/* <button
            onClick={handleSearch}
            className="px-4 py-1.5 transition duration-75 ease-in-out rounded-md text-primary outline outline-2 hover:bg-primary hover:text-white"
          >
            Cari
          </button> */}
        </div>

        <div className="flex flex-col mt-4 lg:flex-row lg:items-start lg:flex-nowrap lg:gap-x-4 lg:mt-7">
          <span className="mt-2 text-sm italic font-semibold text-dark-light lg:mt-4 lg:text-sm xl:text-base">
            Tag Populer:
          </span>
          <ul className="flex text-sm flex-wrap gap-x-2.5 gap-y-2.5 mt-3 lg:text-sm xl:text-base">
            <li className="rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold">
              Berita Teknologi
            </li>
            <li className="rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold">
              Programming
            </li>
            <li className="rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold">
              Edukasi
            </li>
            <li className="rounded-lg bg-primary bg-opacity-10 px-3 py-1.5 text-primary font-semibold">
              Tips & Trik
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="hidden lg:block lg:w-1/2">
        <img
          className="w-[400px] lg:ml-[90px]"
          src={images.Hero}
          alt="users are reading blogs"
        />
      </div> */}
    </section>
  );
};

export default Hero;
