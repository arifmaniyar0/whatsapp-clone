import React,{useState} from 'react';
import './App.css';
// import ImageUploader from 'react-images-upload';
import Whatsapp from './Components/Whatsapp';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import { DataProvider } from './Components/Context';
import Login from './Components/Login';
import axios from 'axios';
import Example from './Example';
// import { Blob } from 'react-blob'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <DataProvider>
            <Route path='/' exact component={Whatsapp} />          
            <Route path='/login' exact component={Login} />  
            <Route path='/test' exact component={Test} />  
            <Route path='/example' exact component={Example} />  
          </DataProvider>        
        </Switch>
     </Router>
    </div>
  );
}


const Test = () => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);

  const fileHandler = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    const file = URL.createObjectURL(e.target.files[0]);
    console.log(file);
    setImg(file)
    // URL.revokeObjectURL(file)
  }

  const uploadFile = async (e) => {
    e.preventDefault(); 

    const formData = new FormData(); 
     
    console.log(file); 

    formData.append( 
      "image", 
      file, 
      file.name 
    ); 
   
    try {
      const res = await axios.post("http://localhost:5000/api/uploadFile", formData,{
        headers : {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);

     } catch(err) {
       console.log('file post error ', err)
     }         
     
  }

  return (
    <>
    <form onSubmit={(e) => uploadFile(e)}>
      <input type='file' onChange={(e) => fileHandler(e)}/>
      <button type='submit'>upload</button>
    </form>
    {img}
    {/* {img && <Blob src='' alt='blob' />} */}
    {/* <ImageUploader
                withIcon={true}
                buttonText='Choose file'
                onChange={fileHandler}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            /> */}
    </>
  )
}


export default App;
