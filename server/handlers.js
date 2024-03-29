const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// rezasahjpaul:Fuckingpassword1995@cluster0.shg0bqv.mongodb.net/
const { v4: uuidv4 } = require("uuid");

const client = new MongoClient(MONGO_URI, options);

const postFinishedProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const projectId = uuidv4();

    await client.connect();
    const db = client.db("WritersBlock");
    const result = await db
      .collection("featuredprojects")
      .insertOne({ id: projectId, title, description });

    res.status(200).json({ message: "Project created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  } finally {
    await client.close();
  }
};

const postNewProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const projectId = uuidv4();

    await client.connect();
    const db = client.db("WritersBlock");
    const result = await db
      .collection("recentlyaddedprojects")
      .insertOne({ id: projectId, title, description });

    res.status(200).json({ message: "Project created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  } finally {
    await client.close();
  }
};

const getProjects = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("WritersBlock");

    const projects = await db.collection("featuredprojects").find().toArray();

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  } finally {
    await client.close();
  }
};

const getNewProjects = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("WritersBlock");

    const projects = await db.collection("recentlyaddedprojects").find().toArray();
    console.log(projects);

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  } finally {
    await client.close();
  }
};

const getProjectById = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("WritersBlock");

    const projectId = req.params.projectId;

    const featuredProject = await db
      .collection("featuredprojects")
      .findOne({ id: projectId });

    if (featuredProject) {
      res.status(200).json({ project: featuredProject });
    } else {
      const recentlyAddedProjects = await db
        .collection("recentlyaddedprojects")
        .findOne({ id: projectId });

      if (recentlyAddedProjects) {
        res.status(200).json({ project: recentlyAddedProjects });
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching project" });
  } finally {
    await client.close();
  }
};

const updateProjectbyId = async (req, res) => {

  try {
    await client.connect();
    const db = client.db("WritersBlock");

    const projectId = req.params.projectId;
    console.log(projectId)


    const updatedProject = req.body;
    console.log(updatedProject)

    let result = await db
      .collection("featuredprojects")
      .updateOne({ id: projectId }, { $set: updatedProject });

    if (result.modifiedCount === 0) {
      result = await db
        .collection("recentlyaddedprojects")
        .updateOne({ id: projectId }, { $set: updatedProject });

      if (result.modifiedCount === 0) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
    }

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating project" });
  } finally {
    await client.close();
  }
};

const deleteProjectbyId = async (req, res) => {

  try {
    await client.connect();
    const db = client.db("WritersBlock");

    const projectId = req.params.projectId;

    const recentlyAddedProjects = await db
    .collection("recentlyaddedprojects")
    .findOne({ id: projectId });

    const featuredProject = await db
      .collection("featuredprojects")
      .findOne({ id: projectId });

      //delete project

      
    const projectDelete = await db
    .collection("recentlyaddedprojects")
    .deleteOne({ id: projectId });


 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching project" });
  } finally {
    await client.close();
  }



}
 


module.exports = {
  postFinishedProject,
  getProjects,
  getProjectById,
  postNewProject,
  getNewProjects,
  updateProjectbyId,
  deleteProjectbyId
};
