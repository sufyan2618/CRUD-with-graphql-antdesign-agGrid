import gql from 'graphql-tag'; 

const typeDefs = gql`
  input UserFilterInput {
    email: String
    role: String
  }

  input UserSortInput {
    field: String!
    order: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    status: String!
    createdAt: String!
  }

  type paginatedUsers {
    items: [User!]!
    totalCount: Int!
  }

  type Query {
    users(page: Int, limit: Int, filter: UserFilterInput, sort: UserSortInput): paginatedUsers
  }

  type Mutation {
    createUser(name: String!, email: String!, role: String!, status: String!): User!
    updateUser(id: ID!, name: String, email: String, role: String, status: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;

export default typeDefs;
