import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import './App.css';
import axios from "axios";
import { ITodo } from "./@types/todo";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import EditingParagraph from "./components/EditingParagraph";
import TodoInformation from "./components/TodoInformation";

function doneTodoItemCount (todos: ITodo[]): number {
  console.log("doneTodoItemCount 함수가 호출되었습니다.");
  return todos.filter(v => !!v.completed).length;
}

const App: React.FunctionComponent = () => {
  const [isEditing, setEditing] = React.useState(false);
  const [todos, setTodos] = React.useState<ITodo[]>([]);

  const deleteTodo = useCallback(async (id: string) => {
    const response  = await axios.delete(`https://todo-backend-modern-js.herokuapp.com/todos/${id}`);
    if (response.status === 200) {
      setTodos(todos.filter(v => v.id !== id));
    }
  }, [todos]);
  const addTodo = useCallback(async (title: string, cb: () => void) => {
    const response  = await axios.post("https://todo-backend-modern-js.herokuapp.com/todos", { title });
    if (response.status === 200) {
      setTodos([...todos, response.data]);
      cb();
    }
  }, [todos]);

  const fetchTodos = useCallback(async () => {
    const response = await axios.get("https://todo-backend-modern-js.herokuapp.com/todos");
    if (response.status === 200) {
      setTodos(response.data);
    }
  }, []);
  const updateTodo = useCallback(async (id: string, title: string) => {
    const response = await axios.patch(`https://todo-backend-modern-js.herokuapp.com/todos/${id}`, { title });
    if (response.status === 200) {
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      setEditing(false);
    }
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, []);
  // @ref: https://overreacted.io/ko/a-complete-guide-to-useeffect/#%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%97%90%EA%B2%8C-%EC%9D%B4%ED%8E%99%ED%8A%B8%EB%A5%BC-%EB%B9%84%EA%B5%90%ED%95%98%EB%8A%94-%EB%B2%95%EC%9D%84-%EA%B0%80%EB%A5%B4%EC%B9%98%EA%B8%B0
  // 만약 빈 배열을 넣어주지 않는다면, 텍스트를 입력할 때마다 API를 호출하게 된다.
  const completedTodoCount = useMemo(() => doneTodoItemCount(todos), [todos]);
  // const completedTodoCount = doneTodoItemCount(todos);
  return (
    <div className="App">
      <Header addTodo={addTodo}/>
      <TodoList
        todos={todos}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
        setEditing={setEditing}
      />
      {isEditing && (
        <EditingParagraph/>
      )}
      <TodoInformation completedTodoCount={completedTodoCount}/>
    </div>
  );
};

export default App;
