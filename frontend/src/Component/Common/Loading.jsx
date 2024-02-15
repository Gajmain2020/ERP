const Loading = () => {
  return (
    <div className="relative flex justify-center items-center mt-5">
      <div className="absolute animate-spin rounded-full h-36 w-36 border-t-4 border-b-4 border-purple-500"></div>
      <img
        src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
        className="rounded-full h-32 w-32"
      />
    </div>
  );
};

export default Loading;
