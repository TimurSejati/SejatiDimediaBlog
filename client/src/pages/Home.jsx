import { Link } from "react-router-dom";
// import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import createAxiosInstance from "../../utils/axiosInstance";
import Hero from "../components/Hero";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await createAxiosInstance().get("/api/post/getPosts");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle errors as needed
      }
    };

    fetchPosts();
  }, []);

  // Rest of your component code

  return (
    <div>
      <div className="flex flex-col gap-6 px-3 mx-auto max-w-8xl">
        <Hero />
      </div>
      {/* <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div> */}

      <div className="flex flex-col max-w-6xl gap-8 p-3 mx-auto py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap pb-10 md:gap-x-5 gap-y-5">
              {posts.map((post) => (
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
      </div>
    </div>
  );
}
