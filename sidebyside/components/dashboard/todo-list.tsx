"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { createTodo, toggleTodo, deleteTodo } from "@/app/actions/todos";
import { useRef, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import ActionButton from "../action-button";

type Todo = {
    id: string;
    title: string;
    is_completed: boolean;
};

function TodoItem({ todo }: { todo: Todo }) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isToggling, startToggleTransition] = useTransition();

    return (
        <div className="group flex items-center gap-3">
            <Checkbox
                checked={todo.is_completed}
                disabled={isToggling || isDeleting}
                onCheckedChange={(checked) => {
                    startToggleTransition(async () => {
                        await toggleTodo(todo.id, checked as boolean);
                    });
                }}
                className={`data-[state=checked]:bg-primary data-[state=checked]:border-primary-foreground data-[state=checked]:text-white ${
                    isToggling ? "opacity-50 cursor-wait" : ""
                }`}
            />

            <span
                className={`text-base flex-1 text-foreground transition-all ${
                    todo.is_completed
                        ? "line-through text-muted-foreground"
                        : ""
                } ${isDeleting ? "opacity-40" : ""}`}
            >
                {todo.title}
            </span>

            <button
                onClick={() => {
                    startDeleteTransition(async () => {
                        await deleteTodo(todo.id);
                    });
                }}
                disabled={isDeleting || isToggling}
                className={`p-1 text-muted-foreground hover:text-destructive transition-all ${
                    isDeleting
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                }`}
            >
                {isDeleting ? (
                    <Loader2 className="size-4.5 text-destructive animate-spin" />
                ) : (
                    <Trash2 className="size-4.5" />
                )}
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
    const [isCreating, startCreateTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        const title = formData.get("title");
        if (!title) return;

        startCreateTransition(async () => {
            await createTodo(formData);
            formRef.current?.reset();
        });
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
                {/* Seznam úkolů */}
                <div className="flex-1 space-y-3 pr-1 min-h-37.5 max-h-75 overflow-y-auto custom-scrollbar">
                    {initialTodos.length === 0 ? (
                        <p className="py-8 text-muted-foreground text-sm text-center italic">
                            Zatím tu nic není. Co je potřeba udělat?
                        </p>
                    ) : (
                        initialTodos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))
                    )}
                </div>

                {/* Formulář přidání */}
                <form
                    ref={formRef}
                    action={handleSubmit}
                    className="flex gap-2 mt-auto pt-2 border-muted border-t"
                >
                    {coupleId && (
                        <input type="hidden" name="coupleId" value={coupleId} />
                    )}
                    <Input
                        name="title"
                        placeholder="Nový úkol..."
                        className="inset-shadow-muted inset-shadow-xs bg-muted border-none h-9 text-sm"
                        autoComplete="off"
                        disabled={isCreating}
                    />
                    <ActionButton
                        type="submit"
                        size="icon"
                        className="bg-secondary hover:bg-secondary-foreground size-9 shrink-0"
                    >
                        {isCreating ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Plus className="size-4" />
                        )}
                    </ActionButton>
                </form>
            </CardContent>
        </Card>
    );
}
