import React, { useState } from "react";
import styled from "styled-components";

type Todo = {
  value: string;
  readonly id: number;
  done: boolean;
  removed: boolean;
};
export const App = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  // todos ステートを更新する関数
  const handleOnSubmit = () => {
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      done: false,
      removed: true,
    };
    /**
     * スプレッド構文を用いて todos ステートのコピーへ newTodo を追加する
     * 以下と同義
     *
     * const oldTodos = todos.slice();
     * oldTodos.unshift(newTodo);
     * setTodos(oldTodos);
     *
     **/
    setTodos([newTodo, ...todos]);
    setText("");
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleOnEdit = (id: number, value: string) => {
    /**
     * ディープコピー:
     * 同じく Array.map() を利用するが、それぞれの要素をスプレッド構文で
     * いったんコピーし、それらのコピー (= Todo 型オブジェクト) を要素とする
     * 新しい配列を再生成する。
     *
     * 以下と同義:
     * const deepCopy = todos.map((todo) => ({
     *   value: todo.value,
     *   id: todo.id,
     * }));
     */
    const deepCopy = todos.map((todo) => ({ ...todo }));

    // ディープコピーされた配列に Array.map() を適用
    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.value = value;
      }
      return todo;
    });

    // todos ステート配列をチェック（あとでコメントアウト）
    console.log("=== Original todos ===");
    todos.map((todo) => console.log(`id: ${todo.id}, value: ${todo.value}`));

    setTodos(newTodos);
  };
  const handleOnCheck = (id: number, checked: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo }));

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.done = !checked;
      }
      return todo;
    });

    setTodos(newTodos);
  };
  const handleOnRemove = (id: number, exist: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo }));

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.removed = !exist;
      }
      return todo;
    });

    setTodos(newTodos);
  };
  const todos_exist = todos.filter((x) => x.removed);
  return (
    <div>
      <Title>React TODO App</Title>
      <CenterDiv>
        {/* コールバックとして () => handleOnSubmit() を渡す */}
        {/*
         * test = ステートの値
         * * setText = ステートの値を更新するメソッド
         * useState の引数 = ステートの初期値 (=空の文字列)
         */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit();
          }}
        >
          <TextInputForm
            type="text"
            value={text}
            onChange={(e) => handleOnChange(e)}
          />
          <InputButton type="submit" value="Add" onSubmit={handleOnSubmit} />
        </form>
      </CenterDiv>
      <ListParent>
        {todos_exist.map((todo) => {
          return (
            <List key={todo.id}>
              <CustomCheckbox
                type="checkbox"
                checked={todo.done}
                onChange={() => handleOnCheck(todo.id, todo.done)}
              />
              <ShowAndEditTodoForm
                type="text"
                disabled={todo.done}
                onChange={(e) => handleOnEdit(todo.id, e.target.value)}
                value={todo.value}
              />
              <DeleteButton
                type="submit"
                value="Remove"
                onClick={() => handleOnRemove(todo.id, todo.removed)}
              />
            </List>
          );
        })}
      </ListParent>
    </div>
  );
};

const ListParent = styled.ul`
  padding-inline-start: 0;
  text-align: center;
`;

const List = styled.li`
  list-style: none;
`;
const CustomCheckbox = styled.input.attrs({ type: "checkbox" })`
  margin: 0;
`;
const Title = styled.h1`
  color: #000;
  text-align: center;
`;
const CenterDiv = styled.div`
  text-align: center;
`;
const TextInputForm = styled.input`
  margin: 0.5rem 0.5rem;
  padding: 0.25em 0.5em;
  width: 220px;
`;
export const ShowAndEditTodoForm = styled(TextInputForm)`
  width: 200px;
`;
const InputButton = styled.input`
  position: relative;
  display: inline-block;
  padding: 0.25em 0.5em;
  text-decoration: none;
  color: #fff;
  background: #fd9535; /*色*/
  border-radius: 4px; /*角の丸み*/
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 0 rgba(0, 0, 0, 0.05);
  font-weight: bold;
  border: solid 2px #fd9535; /*線色*/
`;
const DeleteButton = styled(InputButton)`
  background: #fd532f;
  border-color: #fd532f;
`;
export default App;
