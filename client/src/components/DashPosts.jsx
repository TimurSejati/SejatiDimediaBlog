import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { deletePost, getAllPosts } from "../../services/posts";
import toast from "react-hot-toast";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  let { data } = useQuery({
    queryFn: () => getAllPosts("", currentUser?._id),
    queryKey: ["postId", currentUser._id],
  });

  useEffect(() => {
    setUserPosts(data);
  }, [data]);

  // const handleShowMore = async () => {
  //   const startIndex = userPosts.length;
  //   try {
  //     const res = await fetch(
  //       `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
  //     );
  //     const data = await res.json();
  //     if (res.ok) {
  //       setUserPosts((prev) => [...prev, ...data.posts]);
  //       if (data.posts.length < 9) {
  //         setShowMore(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      let res = await deletePost(postIdToDelete, currentUser.token);
      if (res.status === 200) {
        toast.success(res.data.message);
        // remove logic
        setUserPosts((prevData) => ({
          ...prevData,
          data: prevData?.data.filter((item) => item.slug !== postIdToDelete),
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-3/4 p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && data?.data?.posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Categories</Table.HeadCell>
              <Table.HeadCell>Tags</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts?.data?.posts?.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.photo}
                        alt={post.title}
                        className="object-cover w-20 h-10 bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {post.categories.map((category) => (
                      <small
                        className="p-1.5 mr-1 text-xs text-white rounded-md bg-primary"
                        key={category._id}
                      >
                        {category.title}
                      </small>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {post.tags.map((tag) => (
                      <small
                        className="p-1.5 mr-1 text-xs text-white rounded-md bg-red-500"
                        key={tag._id}
                      >
                        {tag.title}
                      </small>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post.slug);
                      }}
                      className="font-medium text-red-500 cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post2/${post.slug}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              // onClick={handleShowMore}
              className="self-center w-full text-sm text-teal-500 py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p> You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
        className="z-[9999]"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
