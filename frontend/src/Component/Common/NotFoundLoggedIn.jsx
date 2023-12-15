import Wrapper from "./Wrapper";

import ErrorImage from "../../images/error-404.png";

function NotFoundLoggedIn() {
  return (
    <Wrapper>
      <div className="flex flex-col justify-middle align-middle lg:mt-16 sm:mt-64 xs:mt-64">
        <img
          src={ErrorImage}
          alt="404 - Page Not Found"
          className="h-64 w-64 mx-auto "
        />
        <div className="flex flex-col gap-10">
          <h1 className="text-red-200 first-letter:text-7xl first-letter:text-red-400 text-5xl text-center font-bold text-main">
            404 !!
          </h1>
          <p className="text-2xl text-gray-300 text-center">
            Oops! The page you are looking for does not exist.
          </p>
        </div>
      </div>
    </Wrapper>
  );
}

export default NotFoundLoggedIn;
