import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getAllPosts } from "../../services/posts";
import { getAllCategories } from "../../services/categories";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");
        let newSidebarData = { ...sidebarData };

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
          newSidebarData = {
            ...newSidebarData,
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
          };
        }

        setSidebarData(newSidebarData);

        const fetchCategoriesResponse = await getAllCategories();
        if (fetchCategoriesResponse.data) {
          setCategories(fetchCategoriesResponse.data);
        }

        setLoading(true);
        const searchQuery = urlParams.toString();
        const fetchPostsResponse = await getAllPosts(searchQuery, "", "", "");

        if (fetchPostsResponse.data.posts) {
          setPosts(fetchPostsResponse.data.posts);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-b border-gray-500 p-7 md:border-r md:min-h-screen">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="items-center gap-1">
            <label className="font-semibold whitespace-nowrap">
              Kata kunci:
            </label>
            <TextInput
              placeholder="Masukan Pencarian..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="items-center gap-1">
            <label className="font-semibold">Urutan:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </Select>
          </div>
          <div className="items-center gap-1">
            <label className="font-semibold">Kategori:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="">-</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </Select>
          </div>
          {/* <Button outline gradientDuoTone="purpleToPink">
            Cari
          </Button> */}
          <button
            type="submit"
            className="px-4 py-1.5 transition duration-75 ease-in-out rounded-md text-primary outline outline-2 hover:bg-primary hover:text-white"
          >
            Cari
          </button>
        </form>
      </div>
      <div className="flex flex-col w-full gap-8 p-3 mx-auto py-7">
        <h1 className="p-3 mt-5 text-3xl font-semibold border-gray-500 sm:border-b ">
          Hasil Pencarian:
        </h1>
        <div className="flex flex-wrap gap-4 p-7">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">
              Postingan artikel tidak ditemukan
            </p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                cls="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-lg text-teal-500 hover:underline p-7"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
