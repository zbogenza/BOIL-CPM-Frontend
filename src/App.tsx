import { useEffect, useState } from "react";
import { Task, CriticalPathResponse } from "./types";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Task>({
        name: "",
        duration: 0,
        start_event: 0,
        end_event: 0,
    });
    const [criticalPath, setCriticalPath] = useState<string[]>([]);
    const [ganttChartUrl, setGanttChartUrl] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Pobieranie ścieżki krytycznej i wykresu Gantta
    useEffect(() => {
        if (isSubmitted) {
            fetch("http://127.0.0.1:8000/api/critical-path/")
                .then((response) => response.json())
                .then((data: CriticalPathResponse) => {
                    setCriticalPath(data.critical_path);
                    setGanttChartUrl(data.gantt_chart_url);
                    setIsSubmitted(false);
                });
        }
    }, [isSubmitted]);

    // Dodawanie nowego zadania do listy
    const handleAddTask = () => {
        if (!newTask.name || isNaN(newTask.duration) || isNaN(newTask.start_event) || isNaN(newTask.end_event)) {
            alert("Wypełnij poprawnie wszystkie pola!");
            return;
        }

        setTasks([...tasks, newTask]);
        setNewTask({ name: "", duration: 0, start_event: 0, end_event: 0 });
    };

    // Wysyłanie wszystkich zadań do backendu
    const handleSubmitTasks = () => {
        fetch("http://127.0.0.1:8000/api/bulk-tasks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tasks),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Błąd podczas wysyłania danych!");
                }
                return response.json();
            })
            .then(() => setIsSubmitted(true))
            .catch((error) => console.error("Błąd:", error));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Zarządzanie zadaniami</h1>

            {/* Formularz do dodawania nowych zadań */}
            <div className="grid grid-cols-5 gap-2 mt-4">
                <input
                    type="text"
                    placeholder="Nazwa"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    className="border p-2"
                />
                <input
                    type="number"
                    placeholder="Czas (dni)"
                    value={newTask.duration || ""}
                    onChange={(e) =>
                        setNewTask({ ...newTask, duration: parseInt(e.target.value) })
                    }
                    className="border p-2"
                />
                <input
                    type="number"
                    placeholder="Start"
                    value={newTask.start_event || ""}
                    onChange={(e) =>
                        setNewTask({ ...newTask, start_event: parseInt(e.target.value) })
                    }
                    className="border p-2"
                />
                <input
                    type="number"
                    placeholder="Koniec"
                    value={newTask.end_event || ""}
                    onChange={(e) =>
                        setNewTask({ ...newTask, end_event: parseInt(e.target.value) })
                    }
                    className="border p-2"
                />
                <button onClick={handleAddTask} className="bg-blue-500 text-white p-2">
                    Dodaj
                </button>
            </div>

            {/* Lista dodanych zadań */}
            <ul className="mt-4">
                {tasks.map((task, index) => (
                    <li key={index} className="p-2 border-b">
                        {task.name} ({task.start_event} → {task.end_event}) - {task.duration} dni
                    </li>
                ))}
            </ul>

            {/* Przycisk do wysyłania zadań do backendu */}
            <button
                onClick={handleSubmitTasks}
                className="bg-green-500 text-white p-2 mt-4"
            >
                Oblicz ścieżkę krytyczną
            </button>

            {/* Wyświetlanie ścieżki krytycznej */}
            {criticalPath.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Ścieżka Krytyczna</h2>
                    <p>{criticalPath.join(" → ")}</p>
                </div>
            )}

            {/* Wyświetlanie wykresu Gantta */}
            {ganttChartUrl && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Wykres Gantta</h2>
                    <img src={ganttChartUrl} alt="Wykres Gantta" className="border rounded" />
                </div>
            )}
        </div>
    );
}

export default App;
