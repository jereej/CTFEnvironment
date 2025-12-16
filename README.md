# CTFEnvironment

The CTFEnvironment is a university course project that aims to teach some cybersecurity concepts to the "average person" using simple examples and analogies. The environment is browser-based, so all the user needs to do is connect to it through a browser. The environment is containerized and deployed utilizing [Docker Compose](https://docs.docker.com/compose/), allowing for easy set-up. However, the project is **not** a completely out-of-the-box solution, meaning some small changes are needed to make the environment run correctly (*see the Deployment section*).

![lesbaguettes](/client/public/baguette_logo.png)

The website that the user connects belongs to a fictional local family-owned bakery called **Les Baguettes**. The bakery has experienced rapid growth recently and decided it was a good time to set up a website for them to get orders from customers online. However, the people they commissioned the websites from were not very trustworthy and quite literally left a back(room)door on the main page. The website has quite many features (not bugs :bug:, the local health inspectors would not like that) that are left for the user to find and later on report to the bakery so that they would not have to worry about the website and just focus on baking the most delicious bread on the block.

Let's get this :bread:.

## Tasks for the user
In this section, we will explain the exercises associated with this environment. More "lore-accurate" instructions about the tasks can be found in the `baguette_news.pdf` file which is in the environment itself, which are the instructions the user will follow to complete the tasks. The tasks are numbered in an ascending difficulty order, meaning that tasks 1 and 2 are considered easier than tasks 3 and 4.

### Task 1: Warm-up
In this task the user will read the `baguette_news.pdf` file and complete the task based on the information found under the `1. The Wild World of Password Security` chapter. This task is essentially a very elementary exercise combining simple OSINT (Open-Source Intelligence) and some privilege escalation because the user should be able to access Britney's account based on the information found in the chapter. After a successful login, the user will be rewarded with a flag.

### Task 2: Mail inspection
In this task the user will navigate to `/backrooms` from the main page via the *definitely-not-very-obvious* backdoor. After that the user will log into the mail system via the credentials seen in the background image. After logging in, the user will be redirected to `/backrooms/mail` and the task can begin. The point of this task is that the user will read 6 mails, of which some are suspicious and some are not. The user has to mark each mail as not suspicious or suspicious. If the user gets all 6 correct, they will be rewarded with a flag.

### Task 3: More comprehensive OSINT and privilege escalation
In this task the user will perform more comperehensive OSINT and privilege escalation. The OSINT part of the exercise starts **outside** the CTF environment. The user will inspect some clues left in social media platforms, blog posts and the repository. The user can then use this information to get further into the system and use it to get admin rights. With these rights the user can manage the menu and the orders placed by other users. Using these privileges, the user will be rewarded the flag.

### Task 4: Linux environment usage
In this task the user will navigate to `/backrooms` from the main page again through the same backdoor, and use the credentials to log into the bakery's internal server. After logging in, the user will be redirected to `/backrooms/terminal`, where an interactive Linux terminal will be waiting. The users will have to complete 3 tasks in the simulated Linux environment, which get harder, to reveal the final flag for the whole CTF challenge. The users are lead to completing these tasks by reading notes a `baker` has left on the system. Users are also further guided by `challenges` -command, which displays the 3 tasks the users are supposed to complete, and also displays their progress as they complete the tasks. When each of the challenges have been marked as complete, running 'challenges' -command one more time will reveal the final flag for the CTF-challenge.

## Project structure
The below description is based on the `compose.yaml` found in this directory.

### Frontend
The previously described frontend (Les Baguettes client) is built using React in TypeScript. The source code can be found from the `client` folder. A more in-depth description of the client from a developer POV can be found from a `README.md` file in the `client` folder.

### Backend
The frontend depends on the backend to create a full experience for the user. The Les Baguettes client uses the Baguette API which utilizes Django.

### Reverse proxy
The Nginx reverse proxy acts as the entry point for users and further proxies the API requests to the backend.

### Database
The PostgreSQL database is the place where all necessary data about orders, users, etc. is stored.

## Deployment

### Prerequisites
> These instructions are for Linux machines only.

As previously mentioned, the whole environment is deployed using `docker compose`. This means that you need to have a working [Docker installation](https://docs.docker.com/engine/install/) on your machine you plan to host the environment on. Please see the official Docker Engine installation guides if you have not already. After installation, check that the command `docker compose` or `docker-compose` works on your machine.

Also, we mentioned earlier that this is not a completely out-of-the-box solution. This is due to the `PUBLIC_IP` environment variable in the `compose.yaml` file. When you want to run this environment, you need to set the variable yourself. The easiest way to do that is to create a `.env` file in the same directory the `compose.yaml` file is located at and add the following line to it:

```
PUBLIC_IP=xxx.xxx.xxx.xxx
```

After setting the `PUBLIC_IP` value, you need to generate some SSL keys that will be used to deploy the environment. You can easily generate the keys by running the `generate_ssl.sh` script. All the commands you need to run are:

```sh
chmod +x generate_ssl.sh
sudo ./generate_ssl.sh
```

With these steps, you are ready to deploy the environment.

### Deploying the environment
> NOTE: Depending on your docker installation, the docker command itself might require sudo rights.

> NOTE: Depending on your docker installation, you might need to use docker-compose instead of docker compose.

Now that the set-up is done, all you have to simply do is give the command to deploy it.
```
docker compose up -d
```
When you want to stop running the deployment, you can run
```
docker compose down
```

*If you want to delete the existing volumes, you can run*
```
docker compose down -v
```

For some reason, if you run `docker compose down -v`, and you want to restart the environment, in order for the backend to run correctly you need to run
```
docker compose up -d
docker compose down
docker compose up -d
```
and it will work as normal.

If you want to later run it and check that the deployment uses the latest images, you can do
```
docker compose pull
docker compose up -d
```

After running `docker compose up -d` the environment is hosted at `http://YOUR_MACHINE_IP:443` and you should be able to access it remotely. Make sure to check your firewall settings and that you have the required port open.

## Further development

If you wish to use this repository to further develop the client or the server and test your changes on your machine locally, see the `README.md` files in the `client` and `server` folders. Make sure to run the commands given in the instructions **in the respective directory** (e.g. `cd` to the `client` folder before running the commands in the client's`README.md` file).