import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getAllPosts, getAllPostsFront } from "../../services/posts";
import { getAllCategories } from "../../services/categories";
import { getAllTags } from "../../services/tags";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
    tag: "",
  });

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
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
        const tagFromUrl = urlParams.get("tag");
        let newSidebarData = { ...sidebarData };

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
          newSidebarData = {
            ...newSidebarData,
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
            tag: tagFromUrl,
          };
        }

        setSidebarData(newSidebarData);

        const fetchCategoriesResponse = await getAllCategories();
        if (fetchCategoriesResponse.data) {
          setCategories(fetchCategoriesResponse.data);
        }
        const fetchTagsResponse = await getAllTags();
        if (fetchTagsResponse.data) {
          setTags(fetchTagsResponse.data);
        }

        setLoading(true);
        const searchQuery = urlParams.toString();
        const fetchPostsResponse = await getAllPostsFront(
          searchQuery,
          "",
          "",
          ""
        );

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
    if (e.target.id === "tag") {
      const tag = e.target.value || "";
      setSidebarData({ ...sidebarData, tag });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    urlParams.set("tag", sidebarData.tag);
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
    <div className="flex flex-col mx-auto md:flex-row max-w-7xl">
      <div className="flex flex-col w-full gap-8 py-7">
        <div className="p-7">
          <form
            className="flex flex-col items-end justify-center gap-5 md:flex-row"
            onSubmit={handleSubmit}
          >
            <div className="items-center w-full gap-1">
              <label className="mb-1 font-semibold whitespace-nowrap">
                Kata kunci
              </label>
              <TextInput
                className="mt-1"
                placeholder="Masukan Pencarian..."
                id="searchTerm"
                type="text"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="items-center w-full gap-1">
              <label className="font-semibold">Urutan</label>
              <Select
                className="mt-1"
                onChange={handleChange}
                value={sidebarData.sort}
                id="sort"
              >
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
              </Select>
            </div>
            <div className="items-center w-full gap-1">
              <label className="font-semibold">Kategori</label>
              <Select
                className="mt-1"
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
            <div className="items-center w-full gap-1">
              <label className="font-semibold">Tag</label>
              <Select
                className="mt-1"
                onChange={handleChange}
                value={sidebarData.tag}
                id="tag"
              >
                <option value="">-</option>
                {tags?.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="items-end w-full gap-1">
              <label htmlFor="">&nbsp;</label>
              <button
                type="submit"
                className="w-full px-4 py-2 mb-0.5 transition duration-75 ease-in-out rounded-md text-primary outline outline-2 hover:bg-primary hover:text-white"
              >
                Cari
              </button>
              {/* <Button outline gradientDuoTone="purpleToPink">
                Cari
              </Button> */}
            </div>
          </form>
        </div>
        <div>
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
    </div>
  );
}
