//1)LOCAL XML CALLS :-----------FETCH()

//********************************************************** */
//trying json data to fetch and het responce

import React, { useEffect, useState } from "react";

import axios from "axios";
import { parseString, Builder } from "xml2js";

export default function User() {
  const [userData, setUserdata] = useState([]);
  const [postData, setPostdata] = useState({});
  const [patchData, setPatchdata] = useState("");
 

  //making state of Array for get perticular value(like name,id) from parsed json data
  const [parsedDataArray, setParseddataarray] = useState([]);

  //in this function we get data from fake json typed data server
  const GetFakeJson = () => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setUserdata(json))
      .then((json) => console.log("jsondata", userData))
      .catch((error) => console.error(error));
  };

  //in this function we get data from xml typed data server and convert xml data into json typed
  const GetXmlData = async () => {
    const res = await axios.get("http://127.0.0.1:8000/student");
    console.log("XML_Typed_res ----> ", res.data);

    // parsing xml data
    parseString(res.data, function (err, results) {
      // parsing to json
      let data = JSON.stringify(results);
      console.log("JSON_typed_res---->", JSON.parse(data));

      //take stringify json data into variable ->set finaldata into blank object state
      const FinalData = JSON.parse(data);
      //make variable ,assigned the value that we get from data
      const jsonDataArray = FinalData.root["list-item"];
      setParseddataarray(jsonDataArray);
      console.log("jsonDataArray", jsonDataArray);
    });
  };

  //in this function we post data to server and convert json data into xml typed
  const submit = async (postData) => {
    // const builder = new xml2js.Builder(); creates a new instance of the Builder class provided by the xml2js library.
    // The Builder class is responsible for generating XML documents from JavaScript objects. It has various options
    //  to control the output format, such as setting the root element name, specifying the encoding, defining namespaces, and more.
    // Once you create a Builder instance, you can use its buildObject() method to convert a JavaScript object to an XML string.
    //  The buildObject() method takes a single argument, which is the JavaScript object that you want to convert.
    //inshort use Builder() to convert json data into xml

    if (postData.id) {
      updateData(postData.id, postData);
    } else {
      post_Data(postData);
    }
  };

  const post_Data = async (postData) => {
    console.log("afterClickdata", postData, typeof postData);
    const builder = new Builder();
    const xmlStr = builder.buildObject(postData);
    console.log("xmldata convert==========>", xmlStr);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/student",
        xmlStr,
        {
          headers: {
            "Content-Type": "application/xml",
            Accept: "*/*",
          },
        }
      );
    } catch (error) {
      console.error("posterror", error);
    }
  };

  const updateData = async (id, data) => {
    const builder = new Builder();
    const xmlStr = builder.buildObject(data);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/student/${id}/`,
        xmlStr,
        {
          headers: {
            "Content-Type": "application/xml",
            Accept: "*/*",
          },
        }
      );
    } catch (error) {
      console.error("puterror", error);
    }
  };

  const handlePatch = (data) => {
    console.log("datapatch===>", data);
    axios.patch("http://127.0.0.1:8000/student/", data, {
      headers: {
        "Content-Type": "application/xml",
        Accept: "*/*",
      },
    });
  };

  const handleChangePost = (event) => {
    setPostdata({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangePatch = (event) => {
    console.log("patchstate======>", patchData);
    setPatchdata({
      ...patchData,
      [event.target.name]: event.target.value,
    });
  };

  const Delete = async (id) => {
    // axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
    // setUserdata((userData) => userData.filter((user) => user.id !== id));
    await axios
      .delete(`http://127.0.0.1:8000/student/${id}`)
      .then((res) => console.log("deleted data ", res))
      .catch((err) => console.log("Deleteerr", err));
    setParseddataarray((userData) => userData.filter((user) => user.id !== id));
  };

  //on click edit the data will be shown in tableform fields
  const Edit = async (data) => {
    setPostdata(data);
  };

  useEffect(() => {
    GetFakeJson();
    GetXmlData();
  }, []);

  console.log("Beforeclickdata===>", postData);

  return (
    <div className="User_maindiv  bg-black ">
      <div className=" ">
        <div className="text-white">
          <p className="text-2xl text-center mb-7">XMLHTTP REQUEST-RESPONSE</p>
        </div>

        <div className="flex justify-around">
          <div className="w-80">
            <h1 className="text-white bg-gray-400 h-12">JSON Data:</h1>
            <p className="text-white"> JSON typed api data showed</p>
            {userData &&
              userData.map((user) => (
                <div className="mt-12">
                  <div
                    className="cardDiv bg-gradient-to-r from-indigo-400 via-green-200 to-green-100"
                    key={user.id}
                  >
                    <pre className="">
                      NAME:- {user.name}
                      <br />
                      USERNAME:-{user.username}
                      <br />
                      PHONE:-{user.phone}
                      <br />
                      EMAIL:-{user.email}
                      <br />
                    </pre>
                    {/* <button
                      className="bg-cyan-900 text-slate-200"
                      onClick={() => Delete(user.id)}
                    >
                      del
                    </button> */}
                  </div>
                </div>
              ))}
          </div>

          <div className="">
            <div className="  w-80 ">
              <div>
                <h2 className="text-white bg-gray-400 h-12">XML Data:</h2>
                <p className="text-white">
                  XML Typed data converted to JSON and data showed
                </p>
                {parsedDataArray.map((item) => (
                  <div className="text-center mt-7  bg-gradient-to-r from-purple-300 to-blue-400 w-64 ">
                    <hr />
                    <table>
                      <div className="flex gap-4">
                        <button
                          className="bg-lime-900	text-slate-200"
                          onClick={() => Edit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-cyan-900 text-slate-200"
                          onClick={() => Delete(item.id)}
                        >
                          del
                        </button>
                      </div>

                      <tr>
                        <td>
                          ID :
                          <input
                            value={item.id}
                            className="bg-gradient-to-r "
                            onChange={handleChangePatch}
                            onClick={() => handlePatch(item)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          STID :
                          <input
                            value={item.stid}
                            className="bg-gradient-to-r"
                            onChange={handleChangePatch}
                            onClick={() => handlePatch(item)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Name :
                          <input
                            value={item.name}
                            className="bg-gradient-to-r"
                            onChange={handleChangePatch}
                            onClick={() => handlePatch(item)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Course:
                          <input
                            value={item.course}
                            className="bg-gradient-to-r"
                            onChange={handleChangePatch}
                            onClick={() => handlePatch(item)}
                          />
                        </td>
                      </tr>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid place-items-center mt-10 border-spacing-16 border-cyan-900 border rounded-full bg-[#2424836e]">
        <h1 className="text-white mt-7 mb-5 text-3xl">Form</h1>

        <div className="flex flex-col">
          {/* <label className="text-cyan-300"> ID:</label>
          <input
            type="text"
            name="id"
            disabled
            value={postData.id}
            onChange={handleChangePost}
            className="mt-7 w-64"
          /> */}
          <br />
          <label className="text-cyan-300"> STID:</label>
          <input
            type="text"
            name="stid"
            value={postData.stid}
            onChange={handleChangePost}
            className="mt-7 w-64"
          />
          <br />
          <label className="text-cyan-300"> NAME:</label>
          <input
            type="text"
            name="name"
            value={postData.name}
            onChange={handleChangePost}
            className="mt-7 w-64"
          />
          <br />
          <label className="text-cyan-300"> COURSE:</label>
          <input
            type="text"
            name="course"
            value={postData.course}
            onChange={handleChangePost}
            className="mt-7 w-64"
          />
          <br />

          {/*1)there are not id created in form -->we fill up data and post it to server then id created(post api)
          2)now clicked on edit button ,we have id and also other data which is stated at form input field we change data and update it(put api)   */}
          {postData?.id ? (
            <button
              type="button"
              className="bg-green-300 mt-7 w-64 mb-5"
              onClick={() => submit(postData)}
            >
              UPDATE DATA
            </button>
          ) : (
            <button
              type="button"
              className="bg-green-300 mt-7 w-64 mb-5"
              onClick={() => submit(postData)}
            >
              POST DATA
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
//**************************************************************************************************************

//now use xml typed data ,fetch the data then call the response
//react
