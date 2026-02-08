import { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [product,setProduct]=useState(null), [model,setModel]=useState(null), [bg,setBg]=useState(null),
        [script,setScript]=useState(''), [template,setTemplate]=useState('default');

  const handleSubmit=async()=>{
    const formData=new FormData();
    formData.append('product',product);
    formData.append('model',model);
    formData.append('background',bg);
    formData.append('script',script);
    formData.append('template',template);
    const res=await axios.post('http://localhost:5000/api/create-video',formData,{responseType:'blob'});
    window.open(URL.createObjectURL(res.data));
  }

  return (
    <div className="space-y-2">
      <input type="file" onChange={e=>setProduct(e.target.files[0])}/>
      <input type="file" onChange={e=>setModel(e.target.files[0])}/>
      <input type="file" onChange={e=>setBg(e.target.files[0])}/>
      <textarea placeholder="Script narasi" value={script} onChange={e=>setScript(e.target.value)} className="border p-2 w-full"/>
      <select value={template} onChange={e=>setTemplate(e.target.value)} className="border p-2 w-full">
        <option value="default">Default</option>
        <option value="promo">Promo Hook</option>
      </select>
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Generate Video</button>
    </div>
  )
}
