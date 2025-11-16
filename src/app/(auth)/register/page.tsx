import { RegisterForm } from "@/features/auth/components/register-forum";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default Page;
