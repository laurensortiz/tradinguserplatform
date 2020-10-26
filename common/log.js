import {
  Log
} from '../api/models';

module.exports = function({userId, userAccountId, tableUpdated, action, type, snapShotBeforeAction, snapShotAfterAction}) {
  Log.create({
    userId,
    userAccountId,
    tableUpdated,
    action,
    type,
    snapShotBeforeAction,
    snapShotAfterAction,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};