import {get} from 'lodash';
const queries = {
  list: ({ req, UserAccount, User }) => {
    const status = get(req, 'body.status', 1);
    return {
      where: {
        status,
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName']
            },
          ],
        },
      ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
  get: ({ req, UserAccount, User }) => {
    return {
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username', 'firstName', 'lastName']
            },
          ],
        },
      ],
      order: [ [ 'id', 'DESC' ] ],
    };
  },
};

export default queries;