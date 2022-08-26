import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
   
  app.get('/filteredImage',async (req: Request, res: Response) => {
    // Get image url from query paramater
    let { image_url } :{image_url:string} = req.query;
    
    // checks that image url is in the provided endpoint
    if (!image_url) {
      return res.status(400).send('Provide image url')
    }
     //validates image url
    if (!function validateUrl (image_url: string) {
        
        if (typeof image_url !== 'string') {
          return false;
          }
          return (image_url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) !== null);
      }) {
          return res.status(400).send({
          message: 'Please provide a valid image url'
          })
        }
        
        //filter the image using the image_url
      const filteredImage = await filterImageFromURL(image_url);

      //deletes file on the server after response
        res.status(200).sendFile(filteredImage, () =>{
          deleteLocalFiles([filteredImage])
        });
  });



  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();