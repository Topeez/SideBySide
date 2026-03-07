"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TodoItemProps } from "@/types/todo";

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <div
            className={cn(
                "group flex items-center gap-3 px-1 py-2 border-b-0 rounded-lg transition-all",
                todo.is_optimistic && "opacity-50",
            )}
        >
            <Checkbox
                checked={todo.is_completed}
                onCheckedChange={(checked) =>
                    onToggle(todo.id, checked as boolean)
                }
                disabled={todo.is_optimistic}
                className="shrink-0"
            />

            <span
                className={cn(
                    "flex-1 text-sm transition-all",
                    todo.is_completed && "line-through text-muted-foreground",
                )}
            >
                {todo.title}
            </span>

            <button
                onClick={() => onDelete(todo.id)}
                disabled={todo.is_optimistic}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all disabled:pointer-events-none"
                title="Smazat úkol"
            >
                <Trash2 className="size-3.5" />
            </button>
        </div>
    );
}
