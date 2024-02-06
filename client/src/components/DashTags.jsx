import { Modal, Table, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createTag,
  deleteTag,
  getAllTags,
  updateTag,
} from "../../services/tags";

export default function DashTags() {
  const { currentUser } = useSelector((state) => state.user);
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [idToAction, setIdToAction] = useState("");
  const [tagTitle, setTagTitle] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  let { data } = useQuery({
    queryFn: () => getAllTags(),
    queryKey: ["tags"],
  });

  useEffect(() => {
    setTags(data?.data);
  }, [data]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      let res = await deleteTag(currentUser.token, idToAction);
      if (res.data.status === 200) {
        toast.success(res.data.data.message);
        // remove logic
        setTags((prevData) =>
          prevData?.filter((item) => item._id !== idToAction)
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateTag = async () => {
    const res = await createTag(currentUser.token, {
      title: tagTitle,
    });

    if (res.data.status == 200) {
      toast.success("Berhasil menambahkan tag");
      setTagTitle("");
      navigate(`/dashboard?tab=tags`, { replace: true });
      setTags([...tags, res.data.data]);
    }
  };

  const handleEditTag = async () => {
    const res = await updateTag(currentUser.token, idToAction, {
      title: tagTitle,
    });
    if (res.data.status == 200) {
      toast.success("Berhasil mengubah tag");
      setTagTitle("");
      setTags((prevTags) => {
        return prevTags.map((tag) => {
          if (tag._id === idToAction) {
            return { ...tag, title: tagTitle };
          }
          return tag;
        });
      });
      setIsEdit(false);
    }
  };

  return (
    <div className="w-3/4 p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && tags?.length > 0 ? (
        <>
          <div className="flex gap-2">
            <TextInput
              type="text"
              id="username"
              placeholder="Tag"
              value={tagTitle}
              onChange={(e) => setTagTitle(e.target.value)}
            />
            {isEdit && (
              <Link
                onClick={handleEditTag}
                className="p-2 text-white rounded-md hover:underline bg-primary"
              >
                <span>Ubah</span>
              </Link>
            )}
            <Link
              onClick={handleCreateTag}
              className="p-2 text-white rounded-md hover:underline bg-primary"
            >
              <span>Tambahkan</span>
            </Link>
          </div>
          <Table hoverable className="mt-5 shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Tag</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {tags?.map((tag) => (
              <Table.Body key={tag._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(tag.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{tag.title}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setIdToAction(tag._id);
                      }}
                      className="font-medium text-red-500 cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      onClick={() => {
                        setIdToAction(tag._id);
                        setIsEdit(true);
                        setTagTitle(tag.title);
                      }}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
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
