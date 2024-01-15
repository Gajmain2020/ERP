function UnauthorizedPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-sub font-semibold text-2xl text-red-600 bg-gray-900/60 px-2 py-3 rounded-md underline underline-offset-2">
        Unauthorized Action
      </div>
      <span className="text-lg">
        Sorry , but you do not have the necessary permission to perform this
        activity. Your account lacks the specific access permissions required to
        carry out the requested action. If you believe this is an error or if
        you require additional permissions, please contact the system
        administrator for assistance.
      </span>
      <span className="underline text-lg">Error Code:</span>
      <span className="font-sub flex justify-center items-center font-semibold text-2xl text-red-600 px-2 py-3 rounded-md ">
        403-<span className="text-xl">UNAUTHORIZED_ACTIVITY</span>
      </span>
    </div>
  );
}

export default UnauthorizedPage;
