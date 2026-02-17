"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { createTodo, toggleTodo, deleteTodo } from "@/app/actions/todos";
import { useRef, useOptimistic, startTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import ActionButton from "../action-button";
import { toast } from "sonner";

type Todo = {
    id: string;
    title: string;
    is_completed: boolean;
    is_optimistic?: boolean;
};

function TodoItem({
    todo,
    onToggle,
    onDelete,
}: {
    todo: Todo;
    onToggle: (id: string, checked: boolean) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className="group flex items-center gap-3">
            <Checkbox
                checked={todo.is_completed}
                // Při kliku voláme optimistický update HNED
                onCheckedChange={(checked) => {
                    onToggle(todo.id, checked as boolean);
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary-foreground data-[state=checked]:text-white"
            />

            <span
                className={`text-base flex-1 text-foreground transition-all ${
                    todo.is_completed
                        ? "line-through text-muted-foreground"
                        : ""
                }`}
            >
                {todo.title}
            </span>

            <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                disabled={todo.is_optimistic}
            >
                <Trash2 className="size-4.5" />
            </button>
        </div>
    );
}

export function TodoList({
    initialTodos,
    coupleId,
}: {
    initialTodos: Todo[];
    coupleId: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);

    const [optimisticTodos, addOptimisticTodo] = useOptimistic(
        initialTodos,
        (
            state,
            newTodo:
                | Todo
                | { type: "delete"; id: string }
                | { type: "toggle"; id: string; checked: boolean },
        ) => {
            // Reducer logika pro různé akce

            // A. Přidání
            if ("title" in newTodo) {
                return [...state, newTodo];
            }

            // B. Smazání
            if ("type" in newTodo && newTodo.type === "delete") {
                return state.filter((t) => t.id !== newTodo.id);
            }

            // C. Toggle
            if ("type" in newTodo && newTodo.type === "toggle") {
                return state.map((t) =>
                    t.id === newTodo.id
                        ? { ...t, is_completed: newTodo.checked }
                        : t,
                );
            }

            return state;
        },
    );

    // --- Akce pro Přidání ---
    const handleSubmit = async (formData: FormData) => {
        const title = formData.get("title") as string;
        if (!title) return;

        // 1. Optimistic Update (OKAMŽITĚ)
        const optimisticId = Math.random().toString();
        startTransition(() => {
            addOptimisticTodo({
                id: optimisticId,
                title: title,
                is_completed: false,
                is_optimistic: true,
            });
        });

        // Vyčistíme input
        formRef.current?.reset();

        // 2. Server Action (s Error Handlingem)
        try {
            await createTodo(formData);
        } catch {
            // 3. Pokud to selže
            toast.error("Nepodařilo se vytvořit úkol.");
            // React automaticky vrátí UI zpět (rollback), protože revalidatePath neproběhne
            // nebo prostě proto, že optimistic state žije jen po dobu trvání akce.
        }
    };

    const handleToggle = async (id: string, checked: boolean) => {
        startTransition(() => {
            addOptimisticTodo({ type: "toggle", id, checked });
        });

        // 2. Server
        await toggleTodo(id, checked);
    };

    // --- Akce pro Delete ---
    const handleDelete = async (id: string) => {
        // 1. Okamžitě smažeme z UI
        startTransition(() => {
            addOptimisticTodo({ type: "delete", id });
        });

        // 2. Server
        await deleteTodo(id);
    };

    return (
        <Card className="inset-shadow-muted inset-shadow-xs flex flex-col col-span-12 md:col-span-6 lg:col-span-4 shadow-lg border-none h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingBag className="size-4 text-secondary" /> Společné
                    úkoly
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-4">
                {/* Renderujeme OPTIMISTIC todos, ne initialTodos */}
                <div className="flex-1 space-y-3 pr-1 min-h-37.5 max-h-75 overflow-y-auto custom-scrollbar">
                    {optimisticTodos.length === 0 ? (
                        <p className="py-8 text-muted-foreground text-sm text-center italic">
                            Zatím tu nic není. Co je potřeba udělat?
                        </p>
                    ) : (
                        optimisticTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>

                <form
                    ref={formRef}
                    action={handleSubmit}
                    className="flex gap-2 mt-auto pt-2 border-muted border-t"
                >
                    <input type="hidden" name="coupleId" value={coupleId} />
                    <Input
                        name="title"
                        placeholder="Nový úkol..."
                        className="inset-shadow-muted inset-shadow-xs bg-muted border-none h-9 text-sm"
                        autoComplete="off"
                        required
                    />
                    <ActionButton
                        type="submit"
                        size="icon"
                        className="bg-secondary hover:bg-secondary-foreground size-9 shrink-0"
                    >
                        <Plus className="size-4" />
                    </ActionButton>
                </form>
            </CardContent>
        </Card>
    );
}
