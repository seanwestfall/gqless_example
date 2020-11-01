const axios = require('axios');
const graphql = require("graphql");

// PART 1 - ES6 DESTRUCTURING
const { GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema } = graphql;
// PART 2 - EMPLOYEE TYPE
const EmployeeType = new GraphQLObjectType({
  name: "Employee",
  fields: () => ({
     id: { type: GraphQLInt }
     name: { type: GraphQLString },
     email: { type: GraphQLString },
     age: { type: GraphQLInt }
  })
});
// PART 3 - ROOT QUERY
const RootQuery = new GraphQLObjectType({
   name: "RootQueryType",
   fields: {
      employee: {
          type: EmployeeType,
          args: {
             id: { type: GraphQLInt }
          },
          resolve(parent, args) {
             return axios.get(`http://localhost:3000/employees/${args.id}`)
.then(res => res.data)
          }
     },
      employees: {
          type: new GraphQLList(EmployeeType),
          resolve(parent, args) {
             return axios.get(`http://localhost:3000/employees`)
                   .then(res => res.data)
          }
     }  
  }
});
// MUTATIONS
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addEmployee: {
    type: EmployeeType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return axios
           .post(`http://localhost:3000/employees/`, {
               name: args.name,
               email: args.email,
               age: args.age
        }).then(res => res.data);
     }
  },
    editEmployee: {
        type: EmployeeType,
        args: {
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          age: { type: GraphQLInt },
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve(parent, args) {
           return axios.patch(`http://localhost:3000/employees/${args.id}`, args)
.then(res => res.data);
        }
  },
    deleteEmployee: {
        type: EmployeeType,
        args: {
           id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve(parentValue, args) {
           return axios.delete(`http://localhost:3000/employees/${args.id}`)
.then(res => res.data);
        }
    }
 }
});
// PART 4 - EXPORT SCHEMA
module.exports = new GraphQLSchema({
   query: RootQuery
});
