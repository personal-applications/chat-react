import RegisterForm from "./forms/RegisterForm";

function App() {
  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-[600px] mx-auto">
          <h1 className="text-xl font-semibold text-center">ChatHub</h1>
          <RegisterForm />
        </div>
      </div>
    </>
  );
}

export default App;
