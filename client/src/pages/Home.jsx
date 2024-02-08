import { Link } from "react-router-dom";
// import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import Hero from "../components/Hero";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getAllPostsFront } from "../../services/posts";
import { toast } from "react-hot-toast";
import PostCardSkeleton from "../components/PostCardSkeleton";
import { useState } from "react";

export default function Home() {
  const [page, setPage] = useState(1);
  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await createAxiosInstance().get("/api/post/getPosts");
  //       setPosts(response.data.posts);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //       // Handle errors as needed
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  // Rest of your component code

  const { data, isLoading } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => getAllPostsFront("", "", page),
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const loadMorePosts = () => {
    // fetchNextPage();
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <div className="px-3 mx-auto max-w-7xl">
        <Hero />
      </div>
      {/* <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div> */}

      <div className="flex flex-col gap-8 p-3 mx-auto max-w-7xl py-7">
        <div className="flex flex-wrap pb-10 md:gap-x-5 gap-y-5">
          {isLoading ? (
            [...Array(3)].map((item, index) => (
              <PostCardSkeleton
                key={index}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          ) : (
            <>
              {data?.data?.posts && data?.data?.posts.length > 0 && (
                <div className="flex flex-col gap-6 mt-10">
                  <h2 className="mb-5 text-2xl font-semibold text-left">
                    Postingan Terbaru :
                  </h2>
                  <div className="flex flex-wrap pb-10 md:gap-x-5 gap-y-5">
                    {data?.data?.posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        cls="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                      />
                    ))}
                  </div>
                  {data?.data?.hasNextPage && (
                    // <button
                    //   // to={"/search"}
                    //   onClick={loadMorePosts}
                    //   className="flex items-center px-6 py-3 mx-auto font-bold border-2 rounded-lg gap-x-2 text-primary border-primary"
                    // >
                    //   Load More
                    // </button>

                    <button
                      onClick={loadMorePosts}
                      className="px-4 py-2 mx-auto transition duration-75 ease-in-out rounded-md text-primary outline outline-2 hover:bg-primary hover:text-white"
                    >
                      Muat Lebih Banyak
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
