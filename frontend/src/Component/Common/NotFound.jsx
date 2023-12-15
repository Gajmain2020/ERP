import ErrorImage from "../../images/error-404.png";

export default function Notfound() {
  return (
    <div>
      <div className="flex flex-col justify-middle align-middle ">
        <img
          src={ErrorImage}
          alt="404 - Page Not Found"
          className="h-64 w-64 mx-auto "
        />
        <div className="flex flex-col gap-10">
          <h1 className="text-orange-200 first-letter:text-8xl  first-letter:text-red-500 text-5xl text-center font-bold text-main">
            404 !!
          </h1>
          <p className="text-2xl text-zinc-300">
            Oops! The page you are looking for does not exist.
          </p>
        </div>
      </div>
    </div>
  );
}
