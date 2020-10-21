import {get} from 'lodash';
const queries = {
  list: ({ req, UserAccount, User }) => {
    const status = get(req, 'body.status', 1);
    return {
      where: {
        status,
      },
      attributes: {
        exclude: [ 'personalIdDocument' ],
      },
      include: [
        {
          model: UserAccount,
          as: 'userAccount',
          exclude: [ 'snapShotAccount' ],
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
          exclude: [ 'snapShotAccount' ],
          attributes: ['userId'],
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
  listByUsername: ({ req, UserAccount, User }) => {
    const username = get(req, 'body.username', '');
    return {
      where: {
        username,
      },
      attributes: {
        exclude: [ 'personalIdDocument' ],
      },
      order: [ [ 'id', 'DESC' ] ],
    };
  },
};

export default queries;