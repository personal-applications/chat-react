function App() {
  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-96 mx-auto">
          <h1 className="text-xl font-semibold text-center">ChatHub</h1>
          <div className="bg-base-100 mt-3 p-5 rounded-md flex flex-col gap-y-3">
            <div className="flex gap-x-4">
              <input
                type="text"
                placeholder="First name"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Last name"
                className="input input-bordered w-full"
              />
            </div>
            <input
              type="text"
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Password"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Confirm password"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary">Sign up</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
