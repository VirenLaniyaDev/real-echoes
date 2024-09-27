import { signIn } from "@/auth";

const SignInComponent = () => {
  const handleFormData = async (formData: FormData) => {
    "use server";
    await signIn("credentials", formData);
  };

  return (
    <div className="h-screen grid place-content-center">
      <form action={handleFormData} className="max-w-lg">
        <div className="p-4 bg-slate-800 flex flex-col gap-4">
          <input
            name="identifier"
            type="email"
            className="px-2 py-1 text-black"
          />
          <input name="password" type="password" className="px-2 py-1" />
          <button className="px-2 py-1 border-none rounded-md bg-purple-700 text-white">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInComponent;
