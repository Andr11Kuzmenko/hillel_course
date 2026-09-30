export const getRoot = (req, res) => {
  res.render('index', { title: 'Home', visits: req.session.visits });
};
