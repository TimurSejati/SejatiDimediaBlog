import { Button, Footer, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { getSinglePost, likePost } from "../../services/posts";
import BreadCrumbs from "../components/BreadCrumbs";

import { generateHTML } from "@tiptap/html";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import parse from "html-react-parser";
import Editor from "../components/editor/Editor";
import { useSelector } from "react-redux";
import SuggestedPosts from "../components/SuggestedPosts";
import { HiPencilAlt, HiTag } from "react-icons/hi";
import { FaBookmark, FaThumbsUp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function PostPage() {
  const navigate = useNavigate();
  const { blogSlug } = useParams();
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // const { data, isLoading, isError } = useQuery({
  //   queryFn: () => getSinglePost(blogSlug),
  //   queryKey: ["blogSlug", blogSlug],
  //   // onSuccess: (data) => {},
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true when fetching starts
        const postData = await getSinglePost(blogSlug);
        setData(postData);
        setIsLoading(false); // Set loading state to false when fetching is complete
      } catch (error) {
        setIsError(true); // Set error state to true if there's an error
        setIsLoading(false); // Set loading state to false even if there's an error
        console.error("Error fetching post data:", error);
      }
    };

    fetchData(); // Call fetchData function
  }, [blogSlug]);

  useEffect(() => {
    setbreadCrumbsData([
      { name: "Beranda", link: "/" },
      { name: "Atikel", link: "/search" },
      { name: `${data?.post?.title}`, link: `/blog/${data?.post?.slug}` },
    ]);
    // setBody(
    //   parse(generateHTML(data?.body, [Bold, Italic, Document, Paragraph, Text]))
    // );
  }, [data]);

  const handleLikePost = async (postId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await likePost({ postId, token: currentUser.token });
      if (res.data.status == 200) {
        if (res.data.data.likes.includes(currentUser._id)) {
          toast.success("Anda berhasil menyukai artikel");
        }
        setData((prevData) => ({
          ...prevData,
          post: {
            ...prevData.post,
            likes: res.data.data.likes,
            numberOfLikes: res.data.data.numberOfLikes,
          },
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBookmark = () => {
    toast.success("Fitur dalam pengerjaan");
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <section className="container flex flex-col px-5 py-5 mx-auto max-w-7xl lg:flex-row lg:gap-x-5 lg:items-start">
      <article className="flex-1">
        <BreadCrumbs data={breadCrumbsData} />
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium font-roboto text-dark-hard md:text-[42px] mb-4">
            {data?.post?.title}
          </h1>
          <div>
            {data?.post?.categories.map((category) => (
              <span
                className="px-2 py-1 mr-2 font-medium rounded-md text-primary bg-primary bg-opacity-10"
                key={category._id}
              >
                {category.title}
              </span>
            ))}
          </div>
        </div>
        <span className="flex items-center gap-1 mb-12 text-xs font-medium text-dark-light md:text-base">
          <HiPencilAlt />
          <span>
            {new Date(data?.post?.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </span>
        <img
          className="w-full rounded-xl max-h-[600px]"
          src={data?.post?.photo}
          alt={data?.post?.title}
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-2 my-4">
            <img
              src={data?.post?.user.profilePicture}
              alt="post-profile"
              className="w-9 h-9 md:w-12 md:h-12"
            />
            <span className="items-center text-xl font-medium font-roboto text-dark-hard md:text-[20px]">
              {data?.post?.user.username}
              {data?.post?.tags && (
                <div className="flex items-center">
                  {data?.post?.tags.map((tag, index) => (
                    <div className="flex items-center mr-1" key={tag._id}>
                      {index == 0 && (
                        <HiTag className="mr-1 text-base text-opacity-80 text-primary" />
                      )}
                      <div>
                        <span className="text-base text-gray-500">
                          {tag.title}
                          {index + 1 != data?.post?.tags?.length ? "," : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </span>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleLikePost(data?.post?._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  data?.post?.likes?.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-2xl" />
              </button>
              <div
                className={`${
                  currentUser &&
                  data?.post?.likes?.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                {data?.post?.likes.length > 0 && (
                  <small>{data?.post?.numberOfLikes} suka</small>
                )}
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handleBookmark(data?.post?._id)}
                className={`text-gray-400 hover:text-blue-500`}
                // className={`text-gray-400 hover:text-blue-500 ${
                //   currentUser &&
                //   data?.post?.likes?.includes(currentUser._id) &&
                //   "!text-blue-500"
                // }`}
              >
                <FaBookmark className="text-2xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
          {!isLoading && !isError && (
            <Editor content={data?.post?.body} editable={false} />
          )}
        </div>

        <CommentSection postId={data?.post?._id} />
        {data?.relatedPosts?.length > 0 && (
          <SuggestedPosts
            header="Postingan Terkait"
            relatedPosts={data?.relatedPosts}
            className="mt-8 lg:mt-12"
          />
        )}
      </article>
      <div>
        {/* <div className="mt-7">
          <h2 className="mb-4 font-medium font-roboto text-dark-hard md:text-xl">
            Share on:
          </h2>
          <SocialShareButtons
            url={encodeURI(window.location.href)}
            title={encodeURIComponent(data?.title)}
          />
        </div> */}
      </div>
    </section>
  );
}
