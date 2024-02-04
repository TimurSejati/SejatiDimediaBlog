import { Alert, Button, Modal, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  addComment,
  deleteComment,
  getAllComments,
  likeComment,
} from "../../services/comments";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryFn: () => getAllComments({ postId }),
    queryKey: ["comments", postId],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    setComments(data?.data);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      let dataComment = {
        content: comment,
        postId,
        userId: currentUser._id,
      };

      const res = await addComment({ dataComment });
      if (res.data.status == 200) {
        setComment("");
        setComments([res.data.data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  // useEffect(() => {
  //   const getComments = async () => {
  //     try {
  //       const res = await fetch(`/api/comment/getPostComments/${postId}`);
  //       if (res.ok) {
  //         const data = await res.json();
  //         setComments(data);
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  //   getComments();
  // }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await likeComment({ commentId });
      if (res.data.status == 200) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: res.data.data.likes,
                  numberOfLikes: res.data.data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await deleteComment({ commentId });
      if (res.data.status == 200) {
        toast.success(res.data.data.message);
        console.log(res, "client deleted");
      }
      // const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
      //   method: "DELETE",
      // });
      // if (res.ok) {
      //   const data = await res.json();
      //   setComments(comments.filter((comment) => comment._id !== commentId));
      // }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full max-w-2xl p-3 ">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p>Signed in as:</p>
          <img
            className="object-cover w-5 h-5 rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-primary hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 my-5 text-sm text-primary">
          Anda harus login kalau ingin komentar :
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="p-3 border rounded-md border-primary"
        >
          <Textarea
            className="focus:border-primary"
            placeholder="Tambahkan komentar"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex items-center justify-between mt-5">
            <p className="text-xs text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments?.length === 0 ? (
        <p className="my-5 text-sm">Tidak ada komentar</p>
      ) : (
        <>
          <div className="flex items-center gap-1 my-5 text-sm">
            <p>Comments</p>
            <div className="px-2 py-1 border border-gray-400 rounded-sm">
              <p>{comments?.length}</p>
            </div>
          </div>
          {comments?.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
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
