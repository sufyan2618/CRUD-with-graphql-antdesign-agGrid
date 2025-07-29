import { gql} from '@apollo/client';


export const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int, $filter: UserFilterInput, $sort: UserSortInput) {
    users(page: $page, limit: $limit, filter: $filter, sort: $sort) {
      items {
        id
        name
        email
        role
        status
        createdAt
      }
      totalCount
    }
  }
`;
