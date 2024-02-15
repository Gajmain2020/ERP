/* eslint-disable react/prop-types */

const Wrapper = ({ children }) => {
  return (
    <div className="lg:w-3/4 md:w-3/4 flex flex-col gap-3 sm:w-full xs:w-full min-h-[89vh] mt-2 bg-gray-200/30 p-6 xl:mr-3 lg:mr-3 md:mr-3 sm:mr-5 xs:mx-4 rounded-lg">
      {children}
    </div>
  );
};

export default Wrapper;
