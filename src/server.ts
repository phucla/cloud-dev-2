import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles, isUrlValid } from "./util/util";

(async () => {
  // Init the Express application
  const app: Express = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  /**************************************************************************** */
  app.get("/:filteredimage?", async (req: Request, res: Response) => {
    const { image_url } = req.query as { image_url: string };
    //    1. validate the image_url query
    if (image_url && !isUrlValid(image_url)) {
      res.status(422);
      res.send("The image_url invalid, please try again!");
    }
    //    2. call filterImageFromURL(image_url) to filter the image
    try {
      const filterImage = await filterImageFromURL(image_url);

      //    3. send the resulting file in the response
      res.sendFile(filterImage, (err) => {
        if (err) {
          res.status(422);
          res.send(`Error: ${err}`);
        } else {
          // 4. deletes any files on the server on finish of the response
          deleteLocalFiles([filterImage]);
        }
      });
    } catch (error) {
      res.status(422);
      res.send(`Error: ${error}`);
    }
  });

  //! END @TODO1

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
