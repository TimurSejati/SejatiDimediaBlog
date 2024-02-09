import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";
import { images } from "../constants";
export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-primary">
      <div className="w-full mx-auto max-w-7xl">
        <div className="flex flex-col items-center w-full md:flex-row sm:items-center md:justify-between">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center text-lg font-semibold whitespace-nowrap sm:text-xl dark:text-white"
            >
              <img src={images.Logo} alt="Logo" className="w-24" />
            </Link>
          </div>
          <Footer.Copyright
            href="#"
            by="Sejati Dimedia Blog"
            year={new Date().getFullYear()}
            className="my-4"
          />
          <div className="flex gap-6 mt-4 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon
              href="https://github.com/sahandghavidel"
              icon={BsGithub}
            />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
