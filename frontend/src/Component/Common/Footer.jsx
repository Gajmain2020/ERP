export default function Footer() {
  return (
    <div className="bg-zinc-900/70 mt-10 text-zinc-200 rounded-sm font-main">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          All rights reserved to{" "}
          <a
            className="underline"
            href="https://bitdurg.ac.in/"
            target="_blank"
            rel="noreferrer"
          >
            BIT Durg
          </a>
        </p>
        <p className="text-xs">
          Developed by{" "}
          <a
            href="https://gajendraakagajju.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Gajendra Sahu
          </a>
        </p>
        <p className="text-xs">&copy; 2023 BIT Durg. All rights reserved.</p>
      </div>
    </div>
  );
}
