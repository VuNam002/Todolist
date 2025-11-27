import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <div className="w-full max-full">
        <TodoList />
      </div>
    </main>
  );
}
