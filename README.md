# Function

- **Auth**

  - Login
  - Logout
  - Edit User

- **Case**
  - List
    - Edit
    - Delete
    - Pagination
  - View
    - Naviagte

# .env
- /backend
  - `DATABASE_URL="postgresql://user:passowrd@localhost:5432/law_view"`

# Backend

- prisma
  - `npx prisma migrate dev --name init`
- passport js
- jwt
- axios
- express

## route

- `http://localhost:3001/api/users`

  - GET
  - POST
  - PUT
  - DEL

- `http://localhost:3001/api/cases/`

  - POST: `/` (create a new case)
    ```
    {
      'jid':'',
      'jyear':,
      'jcase':'',
      'jno':,
      'jdate':'',
      'jtitle':'',
      'jfull':'',
      'remarks':'',
      'userId':''
    }
    ```
  - GET: `/list/:size/:page` (get all case)
  - GET: `/count` (get nubmer of cases)
  - GET: `/case/:id` (get case by id)
  - GET: `/all-id` (get id list)
  - PUT: `/update/:id` (update case by id)
  - DEL: `/delete/:id` (delete case by id)

- `http://localhost:3001/api/keywords/`
  - POST: `/`
  - GET: `/list` (get all keywords)
  - PUT: `/update/:id`
  - DEL: `/delete/:id`

# Frontend

- React
- Bootstrap
- axios
- React Bootstrap Notifier
  - https://chadly.github.io/react-bs-notifier/

# Postgresql

- create postgresql docker:
  - `docker run --name postgres-container -e POSTGRES_PASSWORD=pass -d -p 5432:5432 -v /home/curry/postgresql/data:/var/lib/postgresql/data postgres`
- custom network in Docker
  - `docker network create backend_network`
- add .env:
  - `DATABASE_URL="postgresql://user:passowrd@localhost:5432/law_view"`
- npx prisma generate
- npx prisma migrate dev --name init

# Linux

- Node

  ```
  [Unit]
  Description=Node.js Server
  After=network.target

  [Service]
  Type=simple
  User=your_username
  WorkingDirectory=/path/to/your/node/app
  ExecStart=/usr/bin/node index.js
  Restart=on-failure

  [Install]
  WantedBy=multi-user.target

  ```

- React

  ```
  [Unit]
  Description=React App
  After=network.target

  [Service]
  Type=simple
  User=your_username
  WorkingDirectory=/path/to/your/react/app
  ExecStart=/usr/bin/npm start
  Restart=on-failure
  Environment=PORT=3000

  [Install]
  WantedBy=multi-user.target

  ```

- Start

  ```
  sudo systemctl start my-node-app.service
  sudo systemctl start my-react-app.service
  ```

- Permission

  ```

  ```

# Note

- 司法院-判決書系統
  - https://judgment.judicial.gov.tw/FJUD/Default_AD.aspx
- Docker
  - Remove all containers: `sudo docker rm $(sudo docker ps -a -q) -f`
  - Remove all images: `sudo docker rmi $(sudo docker images -q) -f`
