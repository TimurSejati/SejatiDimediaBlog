import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import createAxiosInstance from "../../utils/axiosInstance";
import { images } from "../constants";

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
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  const [dropdown, setDropdown] = useState(false);

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const urlParams = new URLSearchParams(location.search);
  //   urlParams.set("searchTerm", searchTerm);
  //   const searchQuery = urlParams.toString();
  //   navigate(`/search?${searchQuery}`);
  // };

  return (
    <Navbar className="sticky top-0 left-0 right-0 border-b-2 z-[9999]">
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
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profil</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Keluar</Dropdown.Item>
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
          <NavItem key={item.name} item={item} />
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
