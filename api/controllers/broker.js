import { Broker } from '../models';
import { brokerQuery } from '../queries';

module.exports = {
  async create(req, res) {
    try {
      const broker = await Broker.create({
        name: req.body.name,
        status: 1,
        createdAt: new Date(),
      });

      return res.status(200).send(broker);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async list(req, res) {
    const brokers = await Broker.findAll(
      brokerQuery.list({ req })
    );

    if (!brokers) {
      return res.status(404).send({
        message: '404 on Broker get List',
      });
    }
    return res.status(200).send(brokers);
  },

  async get(req, res) {
    const broker = await Broker.findByPk(
      req.params.brokerId
    );

    if (!broker) {
      return res.status(404).send({
        message: '404 on Broker get',
      });
    }

    return res.status(200).send(broker);
  },

  async update(req, res) {
    const broker = await Broker.findOne({
      where: {
        id: req.params.brokerId,
      },
    });

    if (!broker) {
      return res.status(404).send({
        message: '404 on Broker update',
      });
    }

    const updatedBroker = await broker.update({
      name: req.body.name || broker.name,
      code: req.body.code || broker.code,
      updatedAt: new Date(),
    });

    return res.status(200).send(updatedBroker);
  },

  async delete(req, res) {
    const broker = await Broker.findOne({
      where: {
        id: req.params.brokerId,
      },
    });

    if (!broker) {
      return res.status(404).send({
        message: 'Broker Not Found',
      });
    }

    //await broker.destroy();
    await broker.update( {
      status: 0,
    } );

    return res.status(200).send({
      message: 'Broker has been deleted',
    });
  },
};
