# Studdit
Made by Marc Bouwman

## setup
Requires an .env file with:  
```
PORT=443
MDB_HOST={server host name}
MDB_USER={username}
MDB_PASSWORD=******
NEO_CONNECTIONSTRING={full connection string}
NEO_USER={username}
NEO_PASSWORD=******
```

These connections must lead to an external server. Localhost connections are not supported as of now.

## installation
- `npm install`
- `npm build`
- `npm start`

## Running tests
`npm test`