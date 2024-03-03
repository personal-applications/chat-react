function App() {
  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-96 mx-auto">
          <h1 className="text-xl font-semibold text-center">Sign up</h1>
          <div className="bg-base-100 mt-3 p-4 rounded-sm">
            <div className="flex gap-0.5">

            <input
              type="text"
              placeholder="First name"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Last name"
              className="input input-bordered w-full max-w-xs"
            />
            </div>
            <input
              type="text"
              placeholder="Email"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Password"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              placeholder="Confirm password"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
