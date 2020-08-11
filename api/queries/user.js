import {get} from 'lodash';
const queries = {
  list: ({ req, User, Role }) => {
    const status = get(req, 'body.status', 1);
    const roleId = get(req, 'body.roleId', 2);

    return {
      where: {
        status: status,
        roleId: roleId,
      },
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
  get: ({ req, User, Role }) => {
    return {
      attributes: {
        exclude: [ 'salt', 'password' ],
      },
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
    };
  },
};

export default queries;