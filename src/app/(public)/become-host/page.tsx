import BecomeHostForm from "@/components/modules/Forms/BecomeHostForm";


export default function BecomeHostPage() {
  return (
    <div className="flex justify-center py-10">
        <p className="text-xs mb-2">
          Tip: Require userId, if you are not logged in first try to login as a USER!
        </p>
      <BecomeHostForm />
    </div>
  );
}