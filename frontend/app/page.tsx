import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <h1 className="text-4xl font-bold mb-8">My Todo List App</h1>
      <div className="w-full max-w-2xl">
        <TodoList />
      </div>
    </main>
  );
}
