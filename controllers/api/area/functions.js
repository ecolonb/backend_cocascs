const Area = require('../../../models/Area');
module.exports = {
  new_area: (req, res) => {
    const formData = req.body;
    const area = new Area(formData);
    area.save((err, result) => {
      if (err) {
        const responseDate = {
          err_: true,
          mssg: err
        };
        return res.status(400).json(err);
      } else {
        const responseData = {
          err_: false,
          mssg: result
        };
        return res.status(200).json(responseData);
      }
    });
  },
  get_all_area: (req, res) => {
    Area.find({}, (err, result) => {
      if (err) {
        const responseData = {
          err_: true,
          mssg: err
        };
        return res.status(400).json(responseData);
      } else {
        const responseData = {
          err_: false,
          mssg: 'request_ok',
          data: result
        };
        return res.status(200).json(responseData);
      }
    });
  }
};
