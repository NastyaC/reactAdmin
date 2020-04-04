import React, {useState, useEffect} from 'react';
import MaterialTable from "material-table";
import useFetch from "../hook/useFetch";

function Editable() {
  const [addData, setAddData] = useState({});
  let postsData = useFetch("http://localhost:3000/posts", {method: "GET"}).data;
  const categoriesData = useFetch("http://localhost:3000/categories", {method: "GET"}).data;
  const [stateData, setStateData] = useState({});

  useEffect(() => {
      console.log("test");
    if (postsData && categoriesData) {
      const categories = {};

      categoriesData.map((currentValue)=>{
        categories[currentValue.id]= currentValue.title
      })

      console.log(postsData);

      setStateData({
        columns: [
          { title: 'Title', field: 'title' },
          { title: 'Text', field: 'body'},
          {
            title: 'category',
            field: 'categoryId',
            lookup: categories,
          },
        ],
        data: postsData
      });
    }

  }, [postsData, categoriesData, addData] )

  function editRequest (url, options, callback, id) {
    fetch(url,  options)
      .then(response => {
        return response.json();
      })
      .then(data => {
        callback(data.id ? data : id);
        setAddData(postsData);
      });
  }

  function deletePost (id) {
    postsData.splice(postsData.findIndex(function(curValue){
        return curValue.id === id;
    }), 1);
  }

  function addPost (data) {
    postsData.push(data);
  }

  function updatePost (data) {
    postsData.forEach((curValue) => {
        if (curValue.id === data.id) {
          Object.assign(curValue, data);
        }
      })
  }


  return (
    <MaterialTable
        title="Editable Preview"
        columns={stateData.columns}
        data={stateData.data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => { 
                editRequest("http://localhost:3000/posts", {
                    method: "POST", 
                    body: JSON.stringify(newData),
                    headers: {
                    "Content-type": "application/json; charset=UTF-8"
                    }},
                    addPost);
                resolve()
              }, 1000)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                editRequest("https://jsonplaceholder.typicode.com/posts/" + newData.id, {
                    method: "PUT", 
                    body: JSON.stringify(newData),
                    headers: {
                    "Content-type": "application/json; charset=UTF-8"
                    }
                  },
                    updatePost);
                resolve()
              }, 1000)
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                  editRequest("https://jsonplaceholder.typicode.com/posts/" + oldData.id, {
                    method: "DELETE"
                    },
                    deletePost, oldData.id);
                resolve()
              }, 1000)
            }),
        }}
      />
  );
}

export default Editable;
