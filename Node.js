const express = require('express');
const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');
const app = express();
const multer = require('multer');
const http = require('http');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/dashboard', (req, res) => {
  res.render("files.ejs");
});

app.get('/login',(req,res) => {
res.render("login.ejs");
});



app.get('/userId',(req,res,err) =>{
  if(err){
    console.log(err);}
    
  ``})


// Endpoint to get the list of files in a specific folder
app.get('/list-files/:folderName', async (req, res) => {
  const folderName = req.params.folderName;

  try {
    const files = await fs.readdir(folderName);
    res.json({ files });
    console.log(files); // Send the list of files as JSON
  } catch (error) {
    console.error('Error reading folder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/toview',(req,res) =>{
  const {filename, filetoview} = req.body;
  console.log(`${filename}`+"-_-"+`${filetoview}`);
  fss.readFile(`${filetoview}`, (err,data)=>{
    if(err){
console.log("Error reading file");
    }else{
const fileExtension = path.extname(`${filename}`).toLowerCase();

let contentType;
switch(fileExtension){
case '.txt':
    contentType = 'text/plain';
    break;
case '.html':
  contentType = 'text/html';
  break;
  case '.png':
    contentType = 'image/png';
    break;
  case '.jpg':
  case '.jpeg':
    contentType = 'image/jpeg';
    break;
  case '.pdf':
    contentType = 'application/pdf';
    console.log("pdf contenttype");
    break;
  // Add more cases for other file types as needed
  default:
    contentType = 'application/octet-stream'; 

}
res.set('Content-Type', contentType);
if (contentType.startsWith('image/')) {
// If the file is an image, send it as Base64 encoded data
const base64Data = Buffer.from(data).toString('base64');
res.send(base64Data);
}
else if(contentType.startsWith('text/')){
const base64Data = Buffer.from(data).toString('base64');
res.send(base64Data);
} 
else {
// For other file types, send the raw data
const base64Data = Buffer.from(data).toString('base64');
res.send(base64Data);
}
    }

  });

});



app.post('/deletefile',(req,res) => {
  const {filetodelete} = req.body;
  fss.unlink(`${filetodelete}`, function (err) {
    
  });
  })
  

  app.post('/sharefile', (req, res) => {
    const { filetoshare, dest } = req.body;
    console.log(`Shared ${filetoshare} with ${dest}`)
  
    fss.copyFile(`${filetoshare}`,`${dest}` , (error) => {
      if (error) {
        
      } else {
        console.log('File has been moved to another folder.')
      }
    })
    
  });
  
  const storage = multer.diskStorage({
    destination: 'uploads/',
    
  });
  
  const upload = multer({ storage });
  app.post('/upload', upload.single('file'), (req, res) => {
    const subject = req.body.subject; // Make sure this matches the field name
    const file = req.file;
    const username = req.body.username;
    
    if (!file) {
      console.log("No file");
      return;
    }
  
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const newName = `${subject}-${originalName}${extension}`;
  
    // Rename and move the uploaded file
    fss.renameSync(file.path, path.join('uploads', newName),(err) =>{
      if(err){
        console.log("Cant upload");
      }else{
        console.log("uploaded");
      }
    });
    
    res.redirect('/dashboard');
    fss.rename(path.join('uploads', newName), path.join(username,newName), (err) => {
        if (err) {
          console.log("failed to upload");
        } else {
          console.log("upload success");
        }
      });
  });

  app.post('/newacc',(req,res) =>{
    const {newid} = req.body;
    console.log(`${newid}`+'  folder created');
    if (!fss.existsSync(`./users/${newid}`)) {
      fss.mkdirSync(`./users/${newid}`)
      console.log('Directory is created.')
      res.send('created');
    } else {
      console.log('Directory already exists.')
    }
  })

  app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
  });
