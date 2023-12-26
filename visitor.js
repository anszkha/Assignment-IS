const { ObjectID } = require("mongodb");

let visitors;

class Visitor {
  static injectDB = async (conn) => {
    if (visitors) {
      return;
    }
    try {
      visitors = await conn.db(process.env.DB_NAME).collection("visitors");
    } catch (e) {
      console.error(`Unable to establish collection handles in visitor model: ${e}`);
    }
  };

  static register = async (id, name, company, purpose) => {
    try {
      // Implement the registration logic
      // Make sure to handle errors and return the appropriate response
    } catch (e) {
      console.error(`Error during visitor registration: ${e}`);
      return { error: e };
    }
  };

  static find = async (id) => {
    try {
      // Implement the find logic
      // Make sure to handle errors and return the appropriate response
    } catch (e) {
      console.error(`Error during finding visitor: ${e}`);
      return null;
    }
  };

  static delete = async (id) => {
    try {
      // Implement the delete logic
      // Make sure to handle errors and return the appropriate response
    } catch (e) {
      console.error(`Error during visitor deletion: ${e}`);
      return { error: e };
    }
  };
}

module.exports = Visitor;
