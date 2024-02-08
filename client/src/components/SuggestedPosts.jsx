import PostCard from "./PostCard";

const SuggestedPosts = ({ className, header, relatedPosts }) => {
  return (
    <div className={`w-full ${className}`}>
      <h2 className="font-medium font-roboto text-dark-hard md:text-xl">
        {header}
      </h2>
      <div className="flex flex-wrap pb-10 mt-5 md:gap-x-5 gap-y-5">
        {relatedPosts?.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            cls="w-full lg:w-[calc(32%-20px)]"
          />
        ))}
      </div>
      {/* <h2 className="mt-8 font-medium font-roboto text-dark-hard md:text-xl">
        Tags
      </h2>
      {tags.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          There is not tags for this post
        </p>
      ) : (
        <div className="flex flex-wrap mt-4 gap-x-2 gap-y-2">
          {tags.map((item, index) => (
            <Link
              key={index}
              to="/"
              className="inline-block rounded-md px-3 py-1.5 bg-primary font-roboto text-xs text-white md:text-sm"
            >
              {item}
            </Link>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default SuggestedPosts;
