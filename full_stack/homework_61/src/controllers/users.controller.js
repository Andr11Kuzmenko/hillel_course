export const getUsers = (req, res) => {
  res.type('text/plain').send('Get users route');
};

export const postUsers = (req, res) => {
  res.status(201).type('text/plain').send(`Post users route (name: ${req.body.name})`);
};

export const getUserById = (req, res) => {
  res.type('text/plain').send(`Get user by Id route: ${req.params.userId}`);
};

export const putUserById = (req, res) => {
  res.type('text/plain').send(`Put user by Id route: ${req.params.userId}`);
};

export const deleteUserById = (req, res) => {
  res.type('text/plain').send(`Delete user by Id route: ${req.params.userId}`);
};
