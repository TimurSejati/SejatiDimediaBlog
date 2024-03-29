import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import {
  bookmarkPost,
  getSinglePost,
  likePost,
  updatePostViews,
} from "../../services/posts";
import BreadCrumbs from "../components/BreadCrumbs";

import Editor from "../components/editor/Editor";
import { useDispatch, useSelector } from "react-redux";
import SuggestedPosts from "../components/SuggestedPosts";
import { HiEye, HiPencilAlt, HiTag } from "react-icons/hi";
import { FaBookmark, FaThumbsUp } from "react-icons/fa";
import toast from "react-hot-toast";
import { bookmarkArticles } from "../redux/user/userSlice";
import { GoBookmarkSlashFill } from "react-icons/go";
import { Helmet } from "react-helmet-async";

export default function PostPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blogSlug } = useParams();
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const { currentUser, bookmarks } = useSelector((state) => state.user);
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

        await updatePostViews({
          postId: postData.post._id,
          token: currentUser?.token,
        });
      } catch (error) {
        setIsError(true); // Set error state to true if there's an error
        setIsLoading(false); // Set loading state to false even if there's an error
        console.error("Error fetching post data:", error);
      }
    };

    fetchData(); // Call fetchData function
  }, [blogSlug, currentUser]);

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

  const handleBookmark = async (postId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await bookmarkPost({ postId, token: currentUser.token });
      if (res.data.status == 201) {
        if (
          res.data?.data?.bookmarks?.some((bookmark) => bookmark._id == postId)
        ) {
          toast.success(res.data?.data?.message);
        }
      }
      dispatch(bookmarkArticles(res.data.data.bookmarks));
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-primary">
        <Spinner size="xl" />
      </div>
    );
  return (
    <div>
      <Helmet>
        <title>Sejati Dimedia Blog - {`${data?.post?.title}`}</title>
        <meta name="description" content={`${data?.post?.caption}`} />
        <meta name="keywords" content={`${data?.post?.title}`} />
        <link rel="canonical" href="http://sejati-dimedia-blog.vercel.app" />
        <meta
          name="keywords"
          content="Sejati Dimedia,Timur Dian Radha Sejati"
        />
        <meta property="og:title" content={`${data?.post?.title}`} />
        <meta property="og:description" content={`${data?.post?.caption}`} />
        <meta property="og:image" content={`${data?.post?.photo}`} />
        <meta property="og:url" content={`/blog/${data?.post?.slug}`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="container flex flex-col px-5 py-5 mx-auto max-w-7xl lg:flex-row lg:gap-x-5 lg:items-start">
        <article className="flex-1">
          <BreadCrumbs data={breadCrumbsData} />
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium font-roboto text-dark-hard md:text-[36px] md:mb-4">
              {data?.post?.title}
            </h1>
            <div>
              {data?.post?.categories.map((category) => (
                <span
                  className="px-2 py-1 mr-2 text-xs rounded-md md:text-base text-primary bg-primary bg-opacity-10"
                  key={category._id}
                >
                  {category.title}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 mb-5 text-xs font-medium text-dark-light md:text-base">
                <HiPencilAlt />
                <span>
                  {new Date(data?.post?.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </span>
              <span className="flex items-center gap-1 mb-5 text-xs font-medium text-dark-light md:text-base">
                <HiEye />
                <span>{data?.post?.views?.length}x Dikunjungi</span>
              </span>
            </div>
          </div>

          <img
            className="w-full rounded-xl max-h-[600px]"
            src={data?.post?.photo}
            alt={data?.post?.title}
            loading="lazy"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 my-4">
              <img
                src={data?.post?.user.profilePicture}
                alt="post-profile"
                className="object-cover w-10 h-10 rounded-full md:w-12 md:h-12"
                loading="lazy"
              />
              <div>
                <span className="items-center text-xs font-medium font-roboto text-dark-hard lg:text-[20px]">
                  {data?.post?.user.username}
                </span>
                {data?.post?.tags && (
                  <div className="flex">
                    {data?.post?.tags.map((tag, index) => (
                      <div
                        className="flex items-center mr-1 text-xs lg:text-base"
                        key={tag._id}
                      >
                        {index == 0 && (
                          <HiTag className="mr-1 text-opacity-80 text-primary" />
                        )}
                        <div>
                          <span className="text-gray-500">{tag.title}</span>
                        </div>
                        {index + 1 != data?.post?.tags?.length ? "," : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 my-4">
              <div className="flex flex-col items-center text-xs md:text-base">
                <button
                  type="button"
                  onClick={() => handleLikePost(data?.post?._id)}
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    data?.post?.likes?.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-lg lg:text-2xl" />
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
                  // className={`text-gray-400 hover:text-blue-500`}
                >
                  {bookmarks?.some(
                    (bookmark) => bookmark._id === data?.post?._id
                  ) ? (
                    <GoBookmarkSlashFill
                      className={`w-5 h-5 md:w-7 md:h-7  text-blue-500`}
                    />
                  ) : (
                    <FaBookmark
                      className={`w-4 h-4 md:w-6 md:h-6 text-lg text-gray-400 hover:text-blue-500`}
                    />
                  )}
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
    </div>
  );
}
