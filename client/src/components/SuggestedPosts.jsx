import React from "react";
import { Link } from "react-router-dom";

const SuggestedPosts = ({ className, header, tags }) => {
  return (
    <div className={`w-full ${className}`}>
      <h2 className="font-medium font-roboto text-dark-hard md:text-xl">
        {header}
      </h2>
      <div className="grid mt-5 gap-y-5 md:grid-cols-2 md:gap-x-5 lg:grid-cols-1">
        {/* {posts.map((item) => (
          <div
            key={item._id}
            className="flex items-center space-x-3 flex-nowrap"
          >
            <img
              className="object-cover w-1/5 rounded-lg aspect-square"
              src={
                item?.photo
                // ? stables.UPLOAD_FOLDER_BASE_URL + item?.photo
                // : images.samplePostImage
              }
              alt={item.title}
            />
            <div className="text-sm font-medium font-roboto text-dark-hard">
              <h3 className="text-sm font-medium font-roboto text-dark-hard md:text-base lg:text-lg">
                <Link to={`/blog/${item.slug}`}>{item.title}</Link>
              </h3>
              <span className="text-xs opacity-60">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))} */}
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
