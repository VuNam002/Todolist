const API_URL = 'https://localhost:51666/api';

export interface TodoItem {
    id: number;
    title: string;
    status: number;  // Đổi từ boolean sang number để khớp với enum
}

export async function fetchTodoItems(): Promise<TodoItem[]> {
    try {
        const res = await fetch(`${API_URL}/TodoItems`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            return [];
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching todo items:', error);
        return [];
    }
}

export async function fetchTodoItemById(id: number): Promise<TodoItem | null> {
    try {
        const res = await fetch(`${API_URL}/TodoItems/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            return null;
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching todo item:', error);
        return null;
    }
}

export async function fetchTodoItemDelete(id: number): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/TodoItems/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.ok;
    } catch (error) {
        console.error('Error deleting todo item:', error);
        return false;
    }
}

export async function fetchTodoItemStatus(id: number, status: number): Promise<TodoItem | null> {
    try {
        const res = await fetch(`${API_URL}/TodoItems/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            // Gửi một đối tượng JSON đơn giản thay vì JSON Patch
            body: JSON.stringify({ status: status }),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Update status failed:', errorText);
            return null;
        }
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await res.json();
        }
        
        return await fetchTodoItemById(id);
    } catch (error) {
        console.error('Error updating status:', error);
        return null;
    }
}

export async function fetchItemEdit(id: number, title: string): Promise<TodoItem | null> {
    try {
        const res = await fetch(`${API_URL}/TodoItems/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            // Gửi một đối tượng JSON đơn giản thay vì JSON Patch
            body: JSON.stringify({ title: title })
        });
        if (!res.ok) {
            return null;
        }
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await res.json();
        }
        
        return await fetchTodoItemById(id);
    } catch (error) {
        console.error('Error editing todo item:', error);
        return null;
    }
}

export async function fetchItemCreate(newItem: { title: string; status: number }): Promise<TodoItem | null> {
    try {
        const res = await fetch(`${API_URL}/TodoItems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newItem.title,
                status: newItem.status  
            })
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Lỗi từ server:', errorText);
            return null;
        }
        return await res.json();
    } catch (error) {
        console.error('Error creating todo item:', error);
        return null;
    }
}