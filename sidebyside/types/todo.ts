export type Todo = {
    id: string;
    title: string;
    is_completed: boolean;
    is_optimistic?: boolean;
};

export type OptimisticTodoAction =
    | { type: "ADD"; todo: Todo }
    | { type: "TOGGLE"; id: string; checked: boolean }
    | { type: "DELETE"; id: string };

export interface TodoListProps {
    todos?: Todo[];
    coupleId: string;
}

export interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, checked: boolean) => void;
    onDelete: (id: string) => void;
}
