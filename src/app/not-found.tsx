import AlwaysWhiteHeader from "@/components/header/AlwaysWhiteHeader";

export default async function NotFound() {
  return (
    <div className="flex h-dvh w-screen flex-col">
      <AlwaysWhiteHeader />

      <div className="flex h-full w-full">
        <p className="m-auto">this page does not exist</p>
      </div>
    </div>
  );
}
