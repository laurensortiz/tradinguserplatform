import {get} from 'lodash';
const queries = {
  list: ({ req, UserAccount, User }) => {
    const status = Number(get(req, 'body.status', 1));
    return {
      where: {
        status: 1,
      },
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  get: ({ req, UserAccount, User }) => {
    return {
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  listByUsername: ({ req }) => {
    const username = get(req, 'body.username', '');
    return {
      where: {
        username,
      },
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]],
      silence: true
    };
  },
};

export default queries;