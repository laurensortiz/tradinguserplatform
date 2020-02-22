import { UserAccount, User, Account } from "../models";

const queries = {
  list: ({ req, UserAccount }) => {
    return {
      attributes: {
        exclude: [],
      },
      where: {
        investmentOperationId: req.params.investmentOperationId,
        status: 1
      },
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, UserAccount }) => {
    return {
      attributes: {
        exclude: [],
      },
      where: {
        investmentOperationId: req.params.investmentOperationId,
        status: 1
      },
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
};

export default queries;