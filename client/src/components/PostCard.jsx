import { BsCheckLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import { HiCalendar, HiPencil, HiPencilAlt, HiTag } from "react-icons/hi";
import { FaThumbsUp } from "react-icons/fa";

export default function PostCard({ post, cls }) {
  const truncateCaption = (caption, maxLength) => {
    if (caption.length > maxLength) {
      return caption.substring(0, maxLength - 3) + "...";
    } else {
      return caption;
    }
  };

  return (
    <div
      className={`${cls} rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]`}
    >
      <div className="relative">
        <Link to={`/blog/${post?.slug}`}>
          <img
            src={post?.photo}
            alt="post1"
            className="object-cover object-center w-full md:h-52 lg:h-48 xl:h-60 max-h-[250px]"
          />
        </Link>
      </div>

      <div className="top-0 p-5">
        {post?.categories.map((category) => (
          <span
            className="px-2 py-1 mr-2 text-xs rounded-md md:text-sm text-primary bg-primary bg-opacity-10"
            key={category._id}
          >
            {category.title}
          </span>
        ))}
        <h2 className="font-roboto font-semibold text-lg text-dark-soft md:text-2xl lg:text-[20px] mt-2">
          <Link to={`/blog/${post?.slug}`}>{post?.title}</Link>
        </h2>
        <span className="flex items-center gap-4 text-xs font-medium text-dark-light md:text-xs">
          <div className="flex items-center gap-1">
            <HiPencilAlt />
            <span>
              {new Date(post?.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          {post?.likes?.length > 0 && (
            <div className="flex items-center gap-1">
              <FaThumbsUp />
              <span>{post?.numberOfLikes} Disukai</span>
            </div>
          )}
        </span>
        {post?.caption && (
          <p className="mt-4 overflow-hidden text-xs text-gray-400 md:text-sm">
            {truncateCaption(post?.caption, 100)}
          </p>
        )}
        <div className="flex items-center justify-between mt-4 flex-nowrap">
          <div className="flex items-center gap-x-2 md:gap-x-2.5">
            <img
              src={post?.user.profilePicture}
              alt="post-profile"
              className="object-cover w-8 h-8 rounded-full md:w-10 md:h-10"
            />
            <div className="flex flex-col">
              <h4 className="text-xs italic font-bold md:text-base taxt-bg-dark-soft">
                {post?.user.username}
              </h4>
              {post?.tags && (
                <div className="flex items-center">
                  {post?.tags.map((tag, index) => (
                    <div
                      className="flex items-center mr-1 text-xs md:text-base"
                      key={tag._id}
                    >
                      {index == 0 && (
                        <HiTag className="mr-1 text-opacity-80 text-primary" />
                      )}
                      <div>
                        <span className="text-gray-500">{tag.title}</span>
                      </div>
                      {index + 1 != post?.tags?.length ? "," : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
<Link to={`/post/${post.slug}`}>
  <img
    src={post.image}
    alt='post cover'
    className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
  />
</Link>
<div className='flex flex-col gap-2 p-3'>
  <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
  <span className='text-sm italic'>{post.category}</span>
  <Link
    to={`/post/${post.slug}`}
    className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
  >
    Read article
  </Link>
</div>
</div> */
}
