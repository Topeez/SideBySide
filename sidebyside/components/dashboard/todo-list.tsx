"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { createTodo, toggleTodo, deleteTodo } from "@/app/actions/todos";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

type Todo = {
    id: string;
    title: string;
    is_completed: boolean;
};

export function TodoList({
    initialTodos = [],
    coupleId,
}: {
    initialTodos: Todo[];
    coupleId: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, setIsPending] = useState(false);

    return (
        <Card className="flex flex-col col-span-12 md:col-span-6 lg:col-span-4 h-full">
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
                            <div
                                key={todo.id}
                                className="group flex items-center gap-3"
                            >
                                <Checkbox
                                    checked={todo.is_completed}
                                    onCheckedChange={async (checked) => {
                                        await toggleTodo(
                                            todo.id,
                                            checked as boolean,
                                        );
                                    }}
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary-foreground data-[state=checked]:text-white"
                                />
                                <span
                                    className={`text-base flex-1 text-foreground ${
                                        todo.is_completed
                                            ? "line-through text-muted-foreground"
                                            : ""
                                    }`}
                                >
                                    {todo.title}
                                </span>

                                {/* Tlačítko smazat (zobrazí se po najetí) */}
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                                >
                                    <Trash2 className="size-4.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Formulář přidání */}
                <form
                    ref={formRef}
                    action={async (formData) => {
                        setIsPending(true);
                        await createTodo(formData);
                        formRef.current?.reset(); // Vyčistit input
                        setIsPending(false);
                    }}
                    className="flex gap-2 mt-auto pt-2 border-muted border-t"
                >
                    <input type="hidden" name="coupleId" value={coupleId} />
                    <Input
                        name="title"
                        placeholder="Nový úkol..."
                        className="bg-muted border-border h-9 text-sm"
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="bg-secondary hover:bg-secondary-foreground size-9 text-white shrink-0"
                        disabled={isPending}
                    >
                        <Plus className="size-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
