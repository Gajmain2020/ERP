/* eslint-disable react/prop-types */

const Heading = ({ children }) => {
  return (
    <div className="lg:text-3xl md:text-2xl text-zinc-900 sm:text-xl xs:text-xl font-heading underline font-semibold flex justify-center item-center">
      {children}
    </div>
  );
};

export default Heading;
