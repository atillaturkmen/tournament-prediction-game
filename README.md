# tournament-prediction-game
**A simple website where people predict upcoming football match scores.**
## Contributors:
- Atilla Türkmen
- Batuhan Arda Sezengöz
- Yusuf Şenyüz
## How to run:
Make sure you have Node.js installed. If you don't have it you can download it from here: https://nodejs.org/en/. 

First of all import sql schema with command `sqlite3 database.db --init "db/model/schema.sql"` or via DB Browser. 

Secondly create a folder named '.env' in the root folder by copying 'template.env'. Fill inside the quotes in '.env':
- db_path: Path to the db file that you created above.
- secret: A random string that encrypts user session data.

Then run `npm install` to install necessary dependencies. 
Finally run `node app.js` in the project folder. Go to *localhost* in the web browser.
## Folder Layout:
- db: Db model and db queries wrapped in js functions
- public: Assets that are served directly to the client
- routes: Express routers that handle GET and POST requests from different URL's.
- views: HTML and EJS templates.
