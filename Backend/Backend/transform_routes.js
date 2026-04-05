const fs = require('fs');
const path = require('path');

const routePath = path.join(__dirname, 'Router', 'route.js');
let code = fs.readFileSync(routePath, 'utf8');

// 1. Remove jsonwebtoken
code = code.replace(/const jwt = require\("jsonwebtoken"\)[\r\n]*/, '');

// 2. Add isAuthenticated middleware and /logout, /check-auth
const middlewareText = `
// Auth Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.email) {
        req.body.email = req.session.email;
        req.query.email = req.session.email;
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

route.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});

route.get('/check-auth', isAuthenticated, (req, res) => {
    return res.status(200).json({ message: 'Authenticated', email: req.session.email });
});
`;

code = code.replace(/(dotenv\.config\(\);)/, '$1\n' + middlewareText);

// 3. Update /signup
code = code.replace(/\/\/ Generate JWT token[\s\S]*?(?=return res\.status\(201\))/m, `// Set session\n        req.session.email = newUser.email;\n\n        `);
code = code.replace(/token,\s*user:/, 'user:');

// 4. Update /login
code = code.replace(/\/\/ Generate JWT token[\s\S]*?(?=return res\.status\(200\))/m, `// Set session\n        req.session.email = user.email;\n\n        `);

// 5. Add isAuthenticated to protected routes
const protectedRoutes = [
    "'/add-task'",
    "'/get-task'",
    "'/delete'",
    '"/update"',
    "'/get-profile'",
    "'/update-profile'",
    "'/set-status'",
    "'/get-name'",
    "'/create-project'",
    "'/get-projects'",
    "'/add-task-to-project'",
    "'/delete-project'",
    "'/update-project'",
    "'/get-activity'",
    "'/dashboard-stats'"
];

for (const pRoute of protectedRoutes) {
    const regex = new RegExp(`(route\\.(?:post|get|delete|put)\\(${pRoute}),\\s*async\\s*\\(req,\\s*res\\)\\s*=>`, 'g');
    code = code.replace(regex, `$1, isAuthenticated, async (req, res) =>`);
}

fs.writeFileSync(routePath, code, 'utf8');
console.log('Transform complete.');
