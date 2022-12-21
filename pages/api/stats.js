
import { findVideoIdByUser, insertStats, updateStats } from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req, res){

  try {
    const token = req.cookies.token;
    if(!token){
      res.status(403).send({});
    }else{

      const inputParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inputParams;

      if(videoId){

        const userId = await verifyToken(token);

        const findVideo = await findVideoIdByUser(token, userId, videoId);
          
        const doesStatsExist = findVideo?.length > 0;

        if(req.method === "POST"){
          const { favourited, watched = true } = req.body;
          if(doesStatsExist){
            //update it
            const response = await updateStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            res.send({ response});
          }else{
            //add it
            const response = await insertStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            res.send({ response});
          }
        }else {
          if(doesStatsExist){
            res.send(findVideo);
          }else{
            res.status(404);
            res.send({ user: null, msg: "Video nor found"});
          }
        }
      }
    }
  } catch (error) {
    console.log("Error occured /stats", error);
    res.status(500).send({ done: false, error: error?.message})
  }
}
  