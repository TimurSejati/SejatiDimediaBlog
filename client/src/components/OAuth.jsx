import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import createAxiosInstance from "../../utils/axiosInstance";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await createAxiosInstance().post("/api/auth/google", {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      });

      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      type="button"
      className="h-10 transition-all duration-200 ease-in-out bg-white rounded-md outline outline-primary text-primary outline-2 hover:bg-primary hover:text-white"
      onClick={handleGoogleClick}
    >
      <div className="flex justify-center item-center">
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        <span>Pakai akun Google</span>
      </div>
    </button>
  );
}
