const UsersHeader = ({ userCount }: { userCount: number }) => (
  <div className="flex justify-between items-center ml-6 mb-6">
    <div>
      <h1 className="text-3xl font-extrabold tracking-wide">Users</h1>
      <p className="text-sm text-gray-400">{`Total ${userCount} user${
        userCount !== 1 ? "s" : ""
      }`}</p>
    </div>
  </div>
);

export default UsersHeader;
