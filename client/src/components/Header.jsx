import {
  Avatar,
  Button,
  Dropdown,
  Modal,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import {
  FaBookmark,
  FaMoon,
  FaRegBookmark,
  FaSun,
  FaUser,
  FaUserAlt,
  FaUserAltSlash,
  FaUserCog,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { bookmarkArticles, signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import createAxiosInstance from "../../utils/axiosInstance";
import { images } from "../constants";
import { HiBookmark, HiLogout, HiUser } from "react-icons/hi";
import { GoBookmarkSlashFill, GoInfo } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import { bookmarkPost } from "../../services/posts";
import toast from "react-hot-toast";

const NavItem = ({ item }) => {
  const path = useLocation().pathname;
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdownHandler = () => {
    setDropdown((curState) => {
      return !curState;
    });
  };

  return (
    <li className="relative group">
      {item.type === "link" ? (
        <>
          {/* `${path == "/blogs" ? "text-primary font-semibold" : ""}` */}
          <Link
            to={item.href}
            className={`px-4 py-2  ${
              path === item.href ? "text-primary font-bold" : ""
            }`}
          >
            {item.name}
          </Link>
          <span className="cursor-pointer text-blue-500 absolute transition-all duration-500 font-bold right-0 top-0 group-hover:right-[90%] opacity-0 group-hover:opacity-100">
            /
          </span>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="flex items-center px-4 py-2 gap-x-1"
            onClick={toggleDropdownHandler}
          >
            <span>{item.name}</span>
            {/* <MdKeyboardArrowDown /> */}
          </button>
          <div
            className={`${
              dropdown ? "block" : "hidden"
            } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
          >
            <ul className="flex flex-col overflow-hidden text-center rounded-lg shadow-lg bg-dark-soft lg:bg-transparent">
              {item.items.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  className="px-4 py-2 text-white hover:bg-dark-hard hover:text-white lg:text-dark-soft"
                >
                  {page.title}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, bookmarks } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  const [dropdown, setDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleDropdownHandler = () => {
    setDropdown((curState) => {
      return !curState;
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const navItemsInfo = [
    { name: "Beranda", type: "link", href: "/" },
    { name: "Artikel", type: "link", href: "/search" },
    { name: "Tentang", type: "link", href: "/about" },
    // {
    //   name: "Pages",
    //   type: "dropdown",
    //   items: [
    //     { title: "About us", href: "/about" },
    //     { title: "Contact us", href: "/contact" },
    //   ],
    // },
    // { name: "Pricing", type: "link", href: "/pricing" },
    // { name: "Faq", type: "link", href: "/faq" },
  ];

  const handleSignout = async () => {
    try {
      const res = await createAxiosInstance().post("/api/user/signout");
      if (res.status === 200) {
        dispatch(signoutSuccess());
      } else {
        console.log(res.data.message);
      }
      // const data = await res.json();
    } catch (error) {
      console.log(error.message);
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
          toast.success("Anda berhasil menandai artikel ini");
        }
        // setData((prevData) => ({
        //   ...prevData,
        //   post: {
        //     ...prevData.post,
        //     likes: res.data.data.likes,
        //     numberOfLikes: res.data.data.numberOfLikes,
        //   },
        // }));
      }
      dispatch(bookmarkArticles(res.data.data.bookmarks));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Navbar className="sticky top-0 left-0 right-0 border-b-2 z-[9999] mx-2">
      <Link
        to="/"
        className="self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white"
      >
        <img src={images.Logo} alt="Logo" className="w-24" />
        {/* <span className="px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Sejati Dimedia
        </span>
        Blog */}
      </Link>
      {/* <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button> */}
      <div className="flex gap-2 md:order-2">
        {/* <Button
          className="hidden w-12 h-10 sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button> */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                className="object-cover"
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>
                <HiUser className="mr-1" /> Profil
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Link onClick={() => setShowModal(true)}>
              <Dropdown.Item>
                <HiBookmark className="mr-1" /> Penanda ({bookmarks?.length})
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>
              <HiLogout className="mr-1" />
              Keluar
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <button className="px-4 py-1.5 transition duration-75 ease-in-out rounded-md text-primary outline outline-2 hover:bg-primary hover:text-white">
              Masuk
            </button>
            {/* <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button> */}
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {navItemsInfo.map((item) => (
          <div key={item.name} className="my-2">
            <NavItem key={item.name} item={item} />
          </div>
        ))}
      </Navbar.Collapse>
      <Modal
        className="z-[99999]"
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header>
          <div className="flex items-center text-center">
            <h3 className="m-2 text-lg text-gray-500 dark:text-gray-400">
              Penanda
            </h3>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="">
            {bookmarks.length == 0 && (
              <div className="flex items-center gap-2 mx-2 text-gray-500 dark:text-gray-400">
                <GoInfo />
                <h1>Belum ada penanda artikel</h1>
              </div>
            )}
            {bookmarks?.map((bookmark) => (
              <div
                key={bookmark._id}
                className="flex items-center justify-between my-4"
              >
                <div className="flex items-center gap-2 text-sm">
                  <img
                    className="w-10 h-10"
                    src={bookmark.photo}
                    alt={bookmark.photo}
                  />
                  <Link to={`/blog/${bookmark?.slug}`} key={bookmark._id}>
                    {bookmark.title}
                  </Link>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleBookmark(bookmark._id)}
                  >
                    <GoBookmarkSlashFill className="text-lg text-blue-500 lg:text-2xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}
