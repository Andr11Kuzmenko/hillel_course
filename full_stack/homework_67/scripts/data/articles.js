const d = (s) => new Date(s);

const a = (title, author, category, tags, views, likes, publishedAt, content) => ({
  title,
  author,
  category,
  tags,
  views,
  likes,
  published: true,
  publishedAt: d(publishedAt),
  content,
});

export const articles = [
  a('Getting started with Express', 'Olena Kovalenko', 'Backend', ['node', 'express'], 1520, 120, '2025-09-01', 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features.'),
  a('Middlewares explained', 'Taras Shevchuk', 'Backend', ['express', 'middleware'], 980, 75, '2025-09-10', 'Middleware functions have access to the request object, the response object and the next function.'),
  a('Templating with PUG and EJS', 'Iryna Bondar', 'Frontend', ['pug', 'ejs', 'templates'], 640, 41, '2025-09-20', 'Template engines let you render dynamic HTML on the server side using data from your application.'),
  a('Cookies, sessions and JWT', 'Mykola Melnyk', 'Security', ['auth', 'jwt', 'cookies'], 1210, 98, '2025-10-02', 'There are several ways to keep a user authenticated: server-side sessions, signed cookies and JSON Web Tokens.'),
  a('Passport.js local strategy', 'Kateryna Oliinyk', 'Security', ['auth', 'passport'], 870, 66, '2025-10-15', 'Passport is authentication middleware for Node.js with more than 500 strategies, local strategy being the simplest.'),
  a('Introduction to MongoDB Atlas', 'Olena Kovalenko', 'Databases', ['mongodb', 'atlas', 'cloud'], 2040, 175, '2025-11-01', 'MongoDB Atlas is a fully managed cloud database service that handles deployment, scaling and backups.'),
  a('CRUD with the MongoDB Node.js driver', 'Vasyl Rudenko', 'Databases', ['mongodb', 'node', 'crud'], 1760, 143, '2025-11-12', 'insertOne, find, updateOne and deleteOne are the core operations of the official MongoDB driver.'),
  a('Cursors in MongoDB', 'Yuliia Moroz', 'Databases', ['mongodb', 'cursor'], 530, 38, '2025-11-25', 'A cursor lets you iterate over query results in batches without loading every document into memory.'),
  a('Aggregation pipeline basics', 'Taras Shevchuk', 'Databases', ['mongodb', 'aggregation'], 1330, 110, '2025-12-05', 'The aggregation pipeline processes documents through stages such as $match, $group, $sort and $project.'),
  a('CSS Grid in practice', 'Iryna Bondar', 'Frontend', ['css', 'layout'], 720, 59, '2025-12-18', 'CSS Grid is a two-dimensional layout system that makes complex page layouts simple.'),
  a('React hooks deep dive', 'Sofiia Tkachenko', 'Frontend', ['react', 'hooks'], 1890, 160, '2026-01-09', 'Hooks let you use state and other React features in function components.'),
  a('Docker for Node.js developers', 'Andrii Kravchenko', 'DevOps', ['docker', 'node'], 1105, 87, '2026-01-22', 'Containers package your application with all its dependencies so it runs the same everywhere.'),
  a('CI/CD with GitHub Actions', 'Mykola Melnyk', 'DevOps', ['ci', 'github'], 940, 70, '2026-02-10', 'GitHub Actions automates building, testing and deploying your code on every push.'),
  a('Securing Express apps', 'Kateryna Oliinyk', 'Security', ['express', 'security', 'helmet'], 1420, 121, '2026-03-03', 'Use helmet, rate limiting, input validation and secure cookies to protect your Express application.'),
  a('Indexes and query performance', 'Vasyl Rudenko', 'Databases', ['mongodb', 'indexes', 'performance'], 860, 64, '2026-03-28', 'Indexes support efficient execution of queries; without them MongoDB must scan every document.'),
];
