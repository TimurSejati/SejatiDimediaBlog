import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { images } from "../constants";
import { signIn } from "../../services/auth";
import toast from "react-hot-toast";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await signIn(formData);
      if (res.data.status !== 200) {
        dispatch(signInFailure(res.data.message));
      }

      if (res.data.status === 200) {
        dispatch(signInSuccess(res.data.data));
        toast.success(res.data.data.message);
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col max-w-3xl gap-5 p-3 mx-auto md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            {/* <span className="px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Sejati Dimedia
            </span>
            Blog */}
            <img src={images.Logo} alt="Logo" className="w-40" />
          </Link>
          <p className="mt-5 text-sm">
            Anda bisa masuk dengan menggunakan akun email atau akun google
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email anda" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password anda" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="h-10 text-white transition-all duration-200 ease-in-out rounded-md bg-primary outline-2 hover:bg-blue-500 hover:text-white"
            >
              <div className="flex justify-center item-center">
                <span>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Masuk"
                  )}
                </span>
              </div>
            </button>
            {/* <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            ></Button> */}
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 text-sm">
            <span>Belum punya akun?</span>
            <Link to="/sign-up" className="text-blue-500">
              Daftar
            </Link>
          </div>
          {/* {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )} */}
        </div>
      </div>
    </div>
  );
}
