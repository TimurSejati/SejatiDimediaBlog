import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSinglePost, updatePost } from "../../services/posts";
import { useSelector } from "react-redux";
import { useState } from "react";
import PostDetailSkeleton from "../components/PostDetailSkeleton";
import ErrorMessage from "../components/ErrorMessage";
import { Alert, Button, FileInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect } from "react";
import Editor from "../components/editor/Editor";
import toast from "react-hot-toast";
import MultiSelectTagDropdown from "../components/MultiSelectTagDropdown";
import { getAllCategories } from "../../services/categories";
import {
  categoryToOption,
  filterCategories,
  tagToOption,
  filterTags,
} from "../../utils/multiSelectTagUtils";
import { getAllTags } from "../../services/tags";

const UpdatePost2 = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(null);
  const [postSlug, setPostSlug] = useState(slug);
  const [caption, setCaption] = useState("");

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost(slug),
    queryKey: ["blog", slug],
    refetchOnWindowFocus: false,
  });

  const promiseCategoryOptions = async (inputValue) => {
    const { data: categoriesData } = await getAllCategories();
    return filterCategories(inputValue, categoriesData);
  };

  const promiseTagOptions = async (inputValue) => {
    const { data: tagsData } = await getAllTags();
    return filterTags(inputValue, tagsData);
  };

  const {
    mutate: mutateUpdatePostDetail,
    isLoading: isLoadingUpdatePostDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updatePost({
        updatedData,
        slug,
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["blog", slug]);
      toast.success("Post is updated");
      navigate(`/dashboard?tab=posts`);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    setInitialPhoto(data?.post?.photo);
    setCategories(data?.post?.categories.map((item) => item._id));
    setTags(data?.post?.tags?.map((item) => item._id));
    setTitle(data?.post?.title);
    setCaption(data?.post?.caption);
    setBody(data?.post?.body);
    // setTags(data?.tags);
  }, [data]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setInitialPhoto(downloadURL);
            // setFormData({ ...formData, photo: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleUpdatePost = async () => {
    let updatedData = new FormData();

    // updatedData.append(
    //   "document",
    //   JSON.stringify({
    //     title,
    //     caption,
    //     body,
    //     slug: postSlug,
    //   })
    // );
    updatedData.append("title", title);
    updatedData.append("caption", caption);
    updatedData.append("slug", postSlug);
    updatedData.append("photo", initialPhoto);
    updatedData.append("body", JSON.stringify(body));
    updatedData.append("categories", JSON.stringify(categories));
    updatedData.append("tags", JSON.stringify(tags));

    mutateUpdatePostDetail({
      updatedData,
      slug,
      token: userState.currentUser.token,
    });
  };

  let isPostDataLoaded = !isLoading && !isError;

  return (
    <div>
      {isLoading ? (
        <PostDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container flex flex-col max-w-5xl px-5 py-5 mx-auto lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            {/* <label htmlFor="postPicture" className="w-full cursor-pointer">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="w-full rounded-xl"
                />
              ) : initialPhoto ? (
                <img
                  src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                  alt={data?.title}
                  className="w-full rounded-xl"
                />
              ) : (
                <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
                  <HiOutlineCamera className="h-auto w-7 text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="postPicture"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="px-2 py-1 mt-5 text-sm font-semibold text-white bg-red-500 rounded-lg w-fit"
            >
              Delete Image
            </button> */}
            <div className="flex items-center justify-between gap-4 p-3 border-4 border-dotted border-primary">
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                outline
                onClick={handleUpdloadImage}
                disabled={imageUploadProgress}
              >
                {imageUploadProgress ? (
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}
            {initialPhoto && (
              <img
                src={initialPhoto}
                alt="upload"
                className="object-cover w-full h-72"
              />
            )}

            <div className="flex gap-2 mt-4">
              {data?.post?.categories?.map((category) => (
                <Link
                  key={category?._id}
                  to={`/blog?category=${category?.name}`}
                  className="inline-block text-sm text-primary font-roboto md:text-base"
                >
                  {category?.name}
                </Link>
              ))}
            </div>
            <div className="w-full my-2 d-form-control">
              <label className="mr-2 d-label" htmlFor="title">
                <span className="d-label-text">Judul</span>
              </label>
              <input
                id="title"
                value={title}
                className="w-full d-input d-input-bordered border-slate-500 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul"
              />
            </div>
            <div className="w-full my-2 d-form-control">
              <label className="mr-2 d-label" htmlFor="caption">
                <span className="d-label-text">Keterangan</span>
              </label>
              <textarea
                id="caption"
                value={caption}
                className="rounded-md w-full d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Keterangan"
              />
            </div>
            <div className="w-full my-2 d-form-control">
              <label className="mr-2 d-label" htmlFor="slug">
                <span className="d-label-text">Slug</span>
              </label>
              <input
                disabled
                id="slug"
                value={postSlug}
                className="w-full d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) =>
                  setPostSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
                }
                placeholder="post slug"
              />
            </div>
            <div className="flex gap-4">
              <div className="mt-2 mb-5">
                <label className="d-label">
                  <span className="d-label-text">Categories</span>
                </label>
                <MultiSelectTagDropdown
                  loadOptions={promiseCategoryOptions}
                  defaultValue={data?.post?.categories.map(categoryToOption)}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                />
              </div>
              <div className="mt-2 mb-5">
                <label className="d-label">
                  <span className="d-label-text">Tags</span>
                </label>
                <MultiSelectTagDropdown
                  loadOptions={promiseTagOptions}
                  defaultValue={data?.post?.tags?.map(tagToOption)}
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                />
              </div>
            </div>

            {/* <div className="mt-2 mb-5">
              <label className="d-label">
                <span className="d-label-text">categories</span>
              </label>
              {isPostDataLoaded && (
                <MultiSelectTagDropdown
                  loadOptions={CategorypromiseOptions}
                  defaultValue={data.categories.map(categoryToOption)}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                />
              )}
            </div> */}
            {/* <div className="mt-2 mb-5">
              <label className="d-label">
                <span className="d-label-text">tags</span>
              </label>
              {isPostDataLoaded && (
                <CreatableSelect
                  defaultValue={data.tags.map((tag) => ({
                    value: tag,
                    label: tag,
                  }))}
                  isMulti
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                  className="relative z-20"
                />
              )}
            </div> */}
            <div className="w-full mt-5 mb-10">
              {isPostDataLoaded && (
                <Editor
                  content={data?.post?.body}
                  editable={true}
                  onDataChange={(data) => {
                    setBody(data);
                  }}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdatePostDetail}
              type="button"
              onClick={handleUpdatePost}
              className="w-full px-4 py-2 font-semibold text-white rounded-lg bg-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update Post
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default UpdatePost2;
