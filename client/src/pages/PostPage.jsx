import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { getSinglePost } from "../../services/posts";
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

export default function PostPage() {
  const { blogSlug } = useParams();
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);
  const userState = useSelector((state) => state.user);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost(blogSlug),
    queryKey: ["blog", blogSlug],
    // onSuccess: (data) => {},
  });

  useEffect(() => {
    setbreadCrumbsData([
      { name: "Home", link: "/" },
      { name: "Blog", link: "/blog" },
      { name: "Article title", link: `/blog/${data?.slug}` },
    ]);
    // setBody(
    //   parse(generateHTML(data?.body, [Bold, Italic, Document, Paragraph, Text]))
    // );
  }, [data]);

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);
  // const [post, setPost] = useState(null);
  // const [recentPosts, setRecentPosts] = useState(null);

  // useEffect(() => {
  //   try {
  //     const fetchRecentPosts = async () => {
  //       const res = await fetch(`/api/post/getposts?limit=3`);
  //       const data = await res.json();
  //       if (res.ok) {
  //         setRecentPosts(data.posts);
  //       }
  //     };
  //     fetchRecentPosts();
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }, []);

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
        <img
          className="w-full rounded-xl"
          src={data?.post?.photo}
          alt={data?.post?.title}
        />
        <div className="flex gap-2 mt-4">
          {data?.post?.categories?.map((category) => (
            <Link
              key={category.id}
              to={`/blog?category=${category.name}`}
              className="inline-block text-sm text-primary font-roboto md:text-base"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <h1 className="text-xl font-medium font-roboto mt-4 text-dark-hard md:text-[26px]">
          {data?.post?.title}
        </h1>
        <div className="w-full"></div>
        <div className="w-full">
          {!isLoading && !isError && (
            <Editor content={data?.post?.body} editable={false} />
          )}
        </div>
        {/* <CommentsContainer
          comments={data?.comments}
          className="mt-10"
          logginedUserId={userState?.userInfo?._id}
          postSlug={slug}
        /> */}
        <CommentSection postId={data?.post?._id} />
        <SuggestedPosts
          header="Postingan Lain"
          relatedPosts={data?.relatedPosts}
          className="mt-8 lg:mt-12"
        />
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
