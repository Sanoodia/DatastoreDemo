const gql = require('graphql-tag');

const listCatHerds = gql`
query ListCatHerds(
  $id: ID
  $cat: ModelStringKeyConditionInput
  $filter: ModelCatHerdFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listCatHerds(
    id: $id
    cat: $cat
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      id
      cat
      type
      gsi1sk
      z_name
      status
      terminal
      district
      carrier
      basin
      crew
      jobs
      load_name
      load_no
      job_id
      linked_terminal_id
      terminal_id
      terminal_name
      linked_product_id
      product_id
      product_name
      stage
      job_name
      load_ids
      district_id
      district_name
      crew_id
      crew_name
      basin_id
      basin_name
      driver_name
      on_duty
      shift
      carrier_id
      carrier_name
      user_id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
    nextToken
    startedAt
  }
}
`;

module.exports = Object.freeze({
    listCatHerds: listCatHerds
});