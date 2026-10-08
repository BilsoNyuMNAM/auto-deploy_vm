import { useState, useEffect} from 'react'
import './App.css'

function App() {
 
  const [input, setInput] = useState("")
  const [todos, setTodos] = useState<any[]>([]) //[{todo, check}, {}]
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  //adding todos
  const handleAddTodo = () => {
    setTodos((prev) => [...prev,
      {
        task:input,
        done:false

      }
    ]) 
    setInput(" ")  
    console.log(todos)
  }
  //sending request to save the todos 
  const submitTodo = ()=>{
    async function saveAlltodos(){
      const result = await fetch("http://16.171.143.249:3000/todos", {
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({todos:todos.filter(t => !t.id)}) // only send new todos that aren't already in DB
      }) 
      const response = await result.json();
      if(response.count){
        setToastMessage("Todos saved successfully! ✅")
        setShowToast(true)
        setTimeout(() => {
            setShowToast(false)
        }, 3000);
      }
      else{
        setToastMessage("Something went wrong ❌")
        console.log("error from the backend", response.error)
        setShowToast(true)

        setTimeout(() => {
            setShowToast(false)
        }, 3000)

      }
    }

    saveAlltodos();
  }

  //fetching all the todos
  useEffect(()=>{
    async function fetchAlltodos(){
      const url = "http://16.171.143.249:3000"
      const result = await fetch(url)
      const altodo = await result.json() 
      console.log("All the todos fetched from the backend", altodo.alltodos)
      setTodos(altodo.alltodos)
      setLoading(false)
    }
    fetchAlltodos()
  },[])
  //completing the todos
  const checkTodo = (key: any)=>{
     const newTodos = [...todos] //copy of todos
     newTodos[key].check = !newTodos[key].check //true = !true 
    
    setTodos(newTodos)
    
  }

  return (
    <div>
      <div>
        <p>Add todos:</p>
        <input 
          type='text' 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button onClick={handleAddTodo}>Add todo</button>
        <div>
          <button onClick={()=>{submitTodo()}}>Save todos</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        todos.map((item, key) => (
        <div>
          <input type="checkbox" checked={item.check} key={key} onChange={()=>{checkTodo(key)}}/>
          <span>{item.task}</span>
        </div>
        ))
      )}



      {showToast && (
            <div style={{
                position: "fixed",  
                bottom: "20px",
                right: "20px",
                backgroundColor: "#333",
                color: "white",
                padding: "12px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 1000,
                fontSize: "14px"
            }}>
                {toastMessage}
            </div>
        )}
    </div>
  )
}

export default App