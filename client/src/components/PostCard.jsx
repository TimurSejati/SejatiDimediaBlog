import { BsCheckLg } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function PostCard({ post, cls }) {
  return (
    <div
      className={`${cls} rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]`}
    >
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post1"
          className="object-cover object-center w-full h-auto md:h-52 lg:h-48 xl:h-60"
        />
      </Link>

      <div className="p-5">
        <h2 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]">
          {post.title}
        </h2>
        <p className="mt-3 text-sm text-dark-light md:text-lg">
          {/* Majority of peole will work in jobs that don’t exist today. */}
        </p>
        <div className="flex items-center justify-between mt-6 flex-nowrap">
          <div className="flex items-center gap-x-2 md:gap-x-2.5">
            <img
              src={post.userId.profilePicture}
              alt="post-profile"
              className="w-9 h-9 md:w-10 md:h-10"
            />
            <div className="flex flex-col">
              <h4 className="text-sm italic font-bold taxt-bg-dark-soft">
                Viola Manisa
              </h4>
              <div className="flex items-center gap-x-2">
                <span className="bg-[#36B37E] w-fit bg-opacity-20 p-1.5 rounded-full">
                  <BsCheckLg className="w-3 h-3 text-[#36B37E]" />
                </span>
                <span className="text-xs italic text-dark-light md:text-sm">
                  Verified Writer
                </span>
              </div>
            </div>
          </div>
          <span className="text-sm italic font-bold text-dark-light md:text-base">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
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
