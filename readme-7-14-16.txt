1. Install node dependencies
  npm install
2. Create database tables
  node_modules\.bin\sequelize db:migrate
3. Run db seeder (in python folder)
  python python\seed.py
4. Run node server
  npm start
5. Run db archiver
  python python\main.py
