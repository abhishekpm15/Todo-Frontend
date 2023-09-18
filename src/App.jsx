import { useState, useId, useEffect } from "react";
import "./App.css";
import uuid from "react-uuid";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [element, setElements] = useState("");
  const id = useId();
  // const [items, setItems] = useState([]);
  const [datas, setDatas] = useState([]);
  const [dataChange, setDataChange] = useState(false);

  useEffect(() => {
    axios
      .get("https://todo-backend-production-4e38.up.railway.app/get-items")
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          return;
        } else setDatas(response.data);
      });
    setDataChange(!dataChange);
  }, [dataChange]);

  const getData = () => {
    axios
      .get("https://todo-backend-production-4e38.up.railway.app/get-items")
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          toast.error("No data found !");
          setTimeout(() => {
            window.location.replace("/");
          }, 2000);
        } else {
          getData();
          setDataChange(!dataChange);
        }
      });
  };

  // const handleDone = (elementId) => {
  //   setItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === elementId ? { ...item, strike: true } : item
  //     )
  //   );
  // };

  const handleAddItems = () => {
    if (element !== "") {
      // setItems([
      //   ...items,
      //   {
      //     id: uuid(),
      //     item: element,
      //     strike: false,
      //   },
      // ]);
      axios({
        method: "post",
        url: "https://todo-backend-production-4e38.up.railway.app/items",
        data: {
          item: element,
          strike: false,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log("toasted");
            toast.success("Successfully inserted the data !");
            getData();
            setDataChange(!dataChange);
            // getData();
            // setTimeout(() => {
            //   window.location.replace("/");
            // }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setElements("");
  };

  // const handleDelete = (id) => {
  //   setItems(items.filter((item) => item.id !== id));
  // };

  const handleDelete = (index, id) => {
    console.log(index);
    axios
      .delete(
        `https://todo-backend-production-4e38.up.railway.app/delete-data/${id}`
      )
      .then((response) => {
        console.log(response.data);
        toast.error("Successfully deleted the data !");
        setTimeout(() => {
          getData();
        }, 500);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col justify-center">
      <ToastContainer autoClose={2000} />

      <div className="text-2xl text-blue-600 font-semibold">
        To-Do Application
      </div>
      <div className="flex justify-center items-center mt-10 space-x-5">
        <div>
          <input
            type="text"
            value={element}
            placeholder="Enter items"
            className="px-4 py-2 border-2 rounded-lg outline-none"
            onChange={(e) => setElements(e.target.value)}
          ></input>
        </div>
        <div
          className="text-xl cursor-pointer bg-blue-500 text-white px-2 rounded-md py-1 "
          onClick={() => {
            handleAddItems();
          }}
        >
          <button>add item</button>
        </div>
      </div>
      <div className="mx-auto justify-center">
        {datas.map((item, index) => {
          return (
            <div key={index} className="mt-5 flex space-x-5 items-center">
              <div
                className={`text-2xl font-semibold w-72 text-left  text-white ${
                  item.strike ? "line-through" : ""
                }`}
              >
                🤜 {item.item}
              </div>
              <div>
                <button
                  className="bg-green-400 p-2 rounded-lg"
                  onClick={() => {
                    handleDone(item.id);
                  }}
                >
                  Done
                </button>
              </div>
              <div>
                <button
                  className="bg-red-400 p-2 rounded-lg"
                  onClick={() => {
                    // handleDelete(item.id);
                    handleDelete(index, item._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
