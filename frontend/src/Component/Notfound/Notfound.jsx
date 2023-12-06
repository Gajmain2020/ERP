import ErrorImage from "../../images/error-404.png";

export default function Notfound() {
  return (
    <div>
      <div className="flex flex-col justify-middle align-middle lg:mt-16 sm:mt-64 xs:mt-64">
        <img
          src={ErrorImage}
          alt="404 - Page Not Found"
          className="h-64 w-64 mx-auto "
        />
        <div className="flex flex-col gap-10">
          <h1 className="text-gray-200 text-5xl text-center font-bold text-main">
            404 !!
          </h1>
          <p className="text-2xl text-gray-300">
            Oops! The page you are looking for does not exist.
          </p>
        </div>
      </div>
    </div>
  );
}
