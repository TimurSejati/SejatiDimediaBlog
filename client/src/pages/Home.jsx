// import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import Hero from "../components/Hero";
import { useQuery } from "@tanstack/react-query";
import { getAllPostsFront } from "../../services/posts";
import { toast } from "react-hot-toast";
import PostCardSkeleton from "../components/PostCardSkeleton";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllPosts } from "../redux/post/postSlice";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPostsAllWithoutLimit = await getAllPostsFront("", "", 1000);
        if (fetchPostsAllWithoutLimit.data) {
          dispatch(getAllPosts(fetchPostsAllWithoutLimit.data?.posts));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const loadMorePosts = () => {
    // fetchNextPage();
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <Helmet>
        <title>Sejati Dimedia Blog</title>
        <link rel="canonical" href="http://sejati-dimedia-blog.vercel.app" />
        <meta
          name="keywords"
          content="Sejati Dimedia,Timur Dian Radha Sejati"
        />
      </Helmet>
      <div className="px-3 mx-auto max-w-7xl">
        <Hero />
      </div>

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
                  <h2 className="text-base font-semibold text-left md:text-xl">
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
                      className="px-2 py-2 mx-auto text-sm transition duration-75 ease-in-out rounded-md md:px-4 md:py-3 md:text-base text-primary outline outline-2 hover:bg-primary hover:text-white"
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
