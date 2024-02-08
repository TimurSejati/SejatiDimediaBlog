import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { images } from "../constants";
import { signUp } from "../../services/auth";
import { toast } from "react-hot-toast";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await signUp(formData);
      if (res.data.status !== 200) {
        return setErrorMessage(res.data.message);
      }
      setLoading(false);
      if (res.data.status == 200) {
        toast.success(res.data.data.message);
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
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
            Anda bisa daftar dengan menggunakan akun email atau akun google
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Nama anda" />
              <TextInput
                type="text"
                placeholder="nama"
                id="username"
                onChange={handleChange}
              />
            </div>
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
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            {/* <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button> */}
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
                    "Daftar"
                  )}
                </span>
              </div>
            </button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 text-sm">
            <span>Sudah punya akun?</span>
            <Link to="/sign-in" className="text-blue-500">
              Masuk
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
