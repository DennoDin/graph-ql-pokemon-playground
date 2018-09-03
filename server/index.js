const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
// The data below is mocked.
const data = require("./data/pokemon.js");

// The schema should model the full data object available.
const schema = buildSchema(`
  type Weight {
    minimum: String
    maximum: String
  }
  type Height {
    minimum: String
    maximum: String
  }
  type EvolutionReqs {
    amount: Int
    name: String
  }
  type IdName {
    id: Int
    name: String
  }
  type SingleAttack {
    name: String
    type: String
    damage: Int
  }
  type Attacks {
    fast: [SingleAttack]
    special: [SingleAttack]
  }

  type Pokemon {
    id: String
    name: String!
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]!
    weight: Weight
    height: Height
    fleeRate: Float
    evolutionRequirements: EvolutionReqs
    evolutions: [IdName]
    maxCP: Int
    maxHP: Int
    attacks: Attacks
  }
  type Query {
    Pokemons: [Pokemon]
    Pokemon(name: String): Pokemon
    Type(type: String): [Pokemon]
    Resists(type: String): [Pokemon]
  }
`);

// The root provides the resolver functions for each type of query or mutation.
const root = {
  Pokemons: () => {
    return data;
  },
  Pokemon: (request) => {
    return data.find((pokemon) => pokemon.name === request.name);
  },
  Type: (request) => {
    return data.filter((pokemon) => pokemon.types.includes(request.type));
  },
  Resists: (request) => {
    return data.filter((pokemon) => pokemon.resistant.includes(request.type));
  },
};

// Start your express server!
const app = express();

/*
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. Setting graphiql
  to 'true' gives you an in-browser explorer to test your queries.
*/
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);

console.log("Running a GraphQL API server at localhost:4000/graphql");
