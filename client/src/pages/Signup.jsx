function Signup() {
  return (
    <div className="p-6 bg-white rounded shadow-md w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      <form className="flex flex-col gap-3">
        <input type="text" placeholder="Name" className="p-2 border rounded" />
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <input type="password" placeholder="Password" className="p-2 border rounded" />
        <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
