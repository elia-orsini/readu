import AlwaysWhiteHeader from "@/components/header/AlwaysWhiteHeader";

export default async function Offline() {
  return (
    <div className="flex h-dvh w-screen flex-col">
      <AlwaysWhiteHeader />

      <div className="flex h-full w-full">
        <p className="m-auto">it seems like you are offline</p>
      </div>
    </div>
  );
}
