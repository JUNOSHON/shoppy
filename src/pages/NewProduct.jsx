import React, {useState} from "react";
import Button from "../components/ui/Button";
import {uploadImage} from "../api/uploader";
import {addNewProduct} from "../api/firebase";

export default function NewProduct() {
  const [product, setProduct] = useState({});
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    uploadImage(file)
      .then(url => {
        
        addNewProduct(product, url)
          .then(() => {
            setSuccess("성공적으로 제품이 추가되었습니다.");
            setTimeout(() => {
              setSuccess(null);
            }, 4000);
          });
        //Firebase 에 새로운 제품을 추가
      })
      .finally(() => setIsUploading(false));
    
    //제품 사진을 Cloudinary 에 업로드하고 URL 을 획득
    
  };
  const handleChange = (e) => {
    const {name, value, files} = e.target;
    if (name === "file") {
      setFile(files && files[0]);
      return;
    }
    setProduct((product) => ({...product, [name]: value}));
    
  };
  return (
    <section className='w-full text-center'>
      <h2 className='text-2xl font-bold my-4'>새로운 제품 등록</h2>
      {success && <p className='my-2'>☑{success}</p>}
      {file && <img src={URL.createObjectURL(file)} alt="local file" className='w-96 mx-auto mb-2' />}
      <form onSubmit={handleSubmit} className='flex flex-col px-12'>
        <input type="file" accept="image/*" name="file" required onChange={handleChange}/>
        <input type="text" name="title" value={product.title ?? ""} placeholder="제품명" required onChange={handleChange}/>
        <input type="number" name="price" value={product.price ?? ""} required placeholder="가격"
               onChange={handleChange}/>
        <input type="text" name="category" value={product.category ?? ""} required placeholder="카테고리"
               onChange={handleChange}/>
        <input type="text" name="description" value={product.description ?? ""} required placeholder="제품 설명"
               onChange={handleChange}/>
        <input type="text" name="options" value={product.options ?? ""} required placeholder="옵션들은 콤마(,)로 구분"
               onChange={handleChange}/>
        <Button text={isUploading ? "업로드 중,,," : "제품 등록하기"} disabled={isUploading}></Button>
      </form>
    </section>
  );
}
