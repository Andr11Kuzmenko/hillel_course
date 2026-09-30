export const getSession = (req, res) => {
  res.json({
    sessionId: req.sessionID,
    visits: req.session.visits,
    lastVisit: req.session.lastVisit,
  });
};

export const destroySession = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.type('text/plain').send('Session destroyed');
  });
};
