import { UserAccount, User, Account } from "../models";

const queries = {
  list: ({ req, UserAccount }) => {
    return {
      attributes: {
        exclude: [],
      },
      where: {
        userAccountId: req.params.userAccountId,
        status: 1
      },
      order: [ [ 'createdAt', 'ASC' ] ],
    };
  },
  get: ({ req, UserAccount }) => {
    return {
      attributes: {
        exclude: [],
      },
      where: {
        userAccountId: req.params.userAccountId,
        status: 1
      },
      order: [ [ 'createdAt', 'ASC' ] ],
    };
  },
};

export default queries;