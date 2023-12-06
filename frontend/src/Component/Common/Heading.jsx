/* eslint-disable react/prop-types */
export default function Heading({ headingTitle }) {
  return (
    <div className="mx-auto w-full text-white">
      <h1 className="text-4xl xs:text-2xl s:text-2xl flex gap-2 justify-center flex-col text-center font-main heading mx-auto">
        {headingTitle}
        <span className="text-sm  text-gray-300/80">
          BIT DURG Online ERP Module
        </span>
      </h1>
    </div>
  );
}
