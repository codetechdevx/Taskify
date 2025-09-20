import { useParams } from "react-router-dom";

export default function EditTaskPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Task {id}</h1>
      <p>Here we will load the TaskForm pre-filled with task data.</p>
    </div>
  );
}
