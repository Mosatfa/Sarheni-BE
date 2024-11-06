import cloudinary from 'cloudinary';


cloudinary.v2.config({
    api_key:"",
    api_secret:"",
    cloud_name: "",
    secure: true
})



export default cloudinary.v2;
