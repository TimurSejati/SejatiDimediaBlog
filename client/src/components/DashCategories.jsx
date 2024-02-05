import { Modal, Table, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/categories";

export default function DashCategories() {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [idToAction, setIdToAction] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  let { data } = useQuery({
    queryFn: () => getAllCategories(),
    queryKey: ["categories"],
  });

  useEffect(() => {
    setCategories(data?.data);
  }, [data]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      let res = await deleteCategory(idToAction);
      if (res.data.status === 200) {
        toast.success(res.data.data.message);
        // remove logic
        setCategories((prevData) =>
          prevData?.filter((item) => item._id !== idToAction)
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateCategory = async () => {
    const res = await createCategory(currentUser.token, {
      title: categoryTitle,
    });

    if (res.data.status == 200) {
      toast.success("Berhasil menambahkan category");
      setCategoryTitle("");
      navigate(`/dashboard?tab=categories`, { replace: true });
      setCategories([...categories, res.data.data]);
    }
  };

  const handleEditCategory = async () => {
    const res = await updateCategory(currentUser.token, idToAction, {
      title: categoryTitle,
    });
    if (res.data.status == 200) {
      toast.success("Berhasil mengubah category");
      setCategoryTitle("");
      setCategories((prevCategories) => {
        return prevCategories.map((category) => {
          if (category._id === idToAction) {
            return { ...category, title: categoryTitle };
          }
          return category;
        });
      });
      setIsEdit(false);
    }
  };

  return (
    <div className="w-3/4 p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && categories?.length > 0 ? (
        <>
          <div className="flex gap-2">
            <TextInput
              type="text"
              id="username"
              placeholder="Category"
              value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)}
            />
            {isEdit && (
              <Link
                onClick={handleEditCategory}
                className="p-2 text-white rounded-md hover:underline bg-primary"
              >
                <span>Ubah</span>
              </Link>
            )}
            <Link
              onClick={handleCreateCategory}
              className="p-2 text-white rounded-md hover:underline bg-primary"
            >
              <span>Tambahkan</span>
            </Link>
          </div>
          <Table hoverable className="mt-5 shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {categories?.map((category) => (
              <Table.Body key={category._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{category.title}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setIdToAction(category._id);
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
                        setIdToAction(category._id);
                        setIsEdit(true);
                        setCategoryTitle(category.title);
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
