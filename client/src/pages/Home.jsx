import { Link } from "react-router-dom";
// import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import Hero from "../components/Hero";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/posts";
import { toast } from "react-hot-toast";

export default function Home() {
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

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-6 px-3 mx-auto max-w-7xl">
        <Hero />
      </div>
      {/* <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div> */}

      <div className="flex flex-col gap-8 p-3 mx-auto max-w-7xl py-7">
        {isLoading ? (
          <>Loading</>
        ) : (
          <>
            {data?.data && data?.data.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-semibold text-center">
                  Recent Posts
                </h2>
                <div className="flex flex-wrap pb-10 md:gap-x-5 gap-y-5">
                  {data?.data.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      cls="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                    />
                  ))}
                </div>
                <Link
                  to={"/search"}
                  className="flex items-center px-6 py-3 mx-auto font-bold border-2 rounded-lg gap-x-2 text-primary border-primary"
                >
                  View all posts
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
