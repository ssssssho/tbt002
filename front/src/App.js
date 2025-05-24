import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "./constants";

function App() {
  // 1. 入力中の文字（input）と、ToDoのリスト（todos）を状態で管理する
  // 2. 追加・削除・完了の処理関数を定義
  // 3. HTMLっぽいJSXで画面をつくる（入力欄・ボタン・リスト）

  // reactでは状態（データの中身）をuseStateで管理する
  const [todos, setTodos] = useState([]);  // やることの一覧（配列）
  const [input, setInput] = useState('');  // 入力フィールド（文字列）
  const [input_date, setInput_Date] = useState('');  // 入力フィールド（日付）

  useEffect(() => {
    fetchTodos();
  }, []);
  
  const fetchTodos = () => {
    fetch(`${ API_BASE_URL }/get_tasks`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("取得エラー:", err));
  };

  const handleAddTodo = () => {
    // 入力値が空の場合、空白を返す
    if (input.trim() === '' || input_date === '') {
      return;
    }else{
      // 保存処理
      const formattedDate = format(new Date(input_date), 'yyyy-MM-dd');
      fetch(`${ API_BASE_URL }/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          date: formattedDate,
        }),
      })
      .then(res => res.json())
      .then(data => {
        console.log("追加成功:", data);
        setInput("");
        setInput_Date("");
        fetchTodos();
      })
      .catch(err => {
        console.error("エラー:", err);
      });
    }
  };

  const handleDelete = (id) => {
      // 削除処理
      fetch(`${ API_BASE_URL }/delete_tasks/${id}`, {
        method: "DELETE",
      })
      .then(res => res.json())
      .then(data => {
        console.log("削除成功:", data);
        fetchTodos();
      })
      .catch(err => {
        console.error("エラー:", err);
      });
  };

  const toggleDone = (id) => {
    setTodos(
      todos.map(todo =>
        // todo.idと画面のidが一致するか判定し、一致する場合、該当するToDoの完了フラグを反転、一致しない場合、他のToDoはそのまま返す
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  return (
    <div className="App">
      <h1>ToDo List</h1>

      <div className="row">
        <div className="col-6">
          <input type="text" className="form-control" value={input} onChange={(e) => setInput(e.target.value)} placeholder="やることを入力" />
        </div>
        <div className="col-3">
          <DatePicker selected={input_date} onChange={(date) => setInput_Date(date)} className="form-control" dateFormat="yyyy/MM/dd" />
        </div>
        <div className="col-3">
          <button className="btn btn-primary" onClick={handleAddTodo}>追加</button>
        </div>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span onClick={() => toggleDone(todo.id)} style={{ textDecoration: todo.done ? 'line-through' : 'none', cursor: 'pointer' }}>
              {todo.text} （{todo.date}）
            </span>
            <button onClick={() => handleDelete(todo.id)} className="btn btn-danger">削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;