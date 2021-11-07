# DevOps-Journey

## Docker

### Images & Containers

- show all running containers : `docker ps`

  ```
  ╭─shifat at dsinnovators in ~ 21-11-07 - 14:39:36
  ╰─○ docker ps
  CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
  23dd47052a32   nginx:latest   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   80/tcp    youthful_galois

  ```

- all containers : `docker ps -a`
- fetch a image (i.e Nginx) from docker-hub registry : `docker pull nginx`
  by default tag is latest which means it will pull the latest version of nginx image. We can aslo use like this `docker pull nginx:latest`

  ```

  ╰─○ docker pull nginx:latest
  latest: Pulling from library/nginx
  b380bbd43752: Pull complete
  fca7e12d1754: Pull complete
  745ab57616cb: Pull complete
  a4723e260b6f: Pull complete
  1c84ebdff681: Pull complete
  858292fd2e56: Pull complete
  Digest: sha256:644a70516a26004c97d0d85c7fe1d0c3a67ea8ab7ddf4aff193d9f301670cf36
  Status: Downloaded newer image for nginx:latest
  docker.io/library/nginx:latest

  ```

- show all docker images oin local machine: `docker images`

  ```

  ╰─○ docker images
  REPOSITORY TAG IMAGE ID CREATED SIZE
  nginx latest 87a94228f133 3 weeks ago 133MB

  ```

- run container from image : `docker run image_name:tag`
  for example : `docker run nginx:latest`.
- Run a container in detached mode : `docker run image_name:tag -d`

  Here the terminal will be clean and container will be running in the background

  A container is an running instance of image

- all containers : `docker container ls`

  ```
  ╭─shifat at dsinnovators in ~ 21-11-07 - 14:39:56
  ╰─○ docker container ls
  CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
  23dd47052a32   nginx:latest   "/docker-entrypoint.…"   3 minutes ago   Up 3 minutes   80/tcp    youthful_galois

  ```

- Stop a container : `docker stop container_id`

  We can also stop container by name like `docker stop youthful_galois` , **youthful_galois** is the name of container (check ps/ls command)

- Run a container and expose a port : `docker run nginx:latest -p 8080:80`
  That means ion our local pc the port `8080` is redirected to the container's port `80`

  ```
  ╭─shifat at dsinnovators in ~ 21-11-07 - 14:49:45
  ╰─○ docker ps
  CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                                   NAMES
  991d5a476b2a   nginx:latest   "/docker-entrypoint.…"   9 seconds ago   Up 8 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   happy_jepsen

  ```

- Map multiple ports : `docker run -p 3000:80 -p 8000:80 image_name:tag `

  here both 3000 and 8000 is mapped to docker container's 80 port

- delete a container : `docker rm container_id/name`
- delete all containers (which are not running now, you need to stop that and delete) : `docker rm $(docker ps -aq)`

  `docker ps -aq` returns only the ids of the containers

- force to delete all containers (doesnt matter about running or not) : `docker rm -f $(docker ps -aq)`

- run container with given name : `docker run --name web nginx:latest`

  ```
  ╭─shifat at dsinnovators in ~ 21-11-07 - 15:58:43
  ╰─○ docker ps
  CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS                                   NAMES
  b34229387d51   nginx:latest   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:3000->80/tcp, :::3000->80/tcp   web


  ```

  here container name is **web**

### Volume

Volumes allows sharing data (files , folders) between host and container and, between containers

#### Share data between host and container :

We will share our website to docker container using volume.

Let's say we have a folder on `docker/example/share_data_between_host_container/static_website/` which contains a static website. We will share this with a container named `website` on port 3000:80 in docker.

- `docker run --name website -p 3000:80 -v $(pwd):/usr/share/nginx/html:ro nginx:latest -d`

  here `pwd` refers to the present working directory (lets assume we are using the command inside our local website folder) and `ro` refers to `read only`

  its actually => `hosts_dir:container_dir:permission_type`

- open shell into a running container : `docker exec -it container_name//id bash`

#### Share data between containers

As we have a container named `website` which is sharing data with the host (local pc). No we want to make e new container that will share data with `website` container.

- `docker run --name website_2 --volumes-from website -d -p 8081:80 nginx:latest`

### Build Own Images

Lets build a image from out previous website whose source codes are available in `docker/example/share_data_between_host_container/static_website/` folder.

First if all add a Dockerfile in the base folder.

Dockerfile

```Dockerfile
FROM nginx:latest
ADD . /usr/share/nginx/html
```

At first we are pulling the nginx from docker registry. Then will copy all the files of our local folder into `/usr/share/nginx/html` in the image container.

file structure will look like this :

```
(base)  jspw@brainFuck  ~/Documents/Projects/DevOps-Journey/docker/example/share_data_between_host_container/static_website   main ±  la
total 80K
-rw-rw-r-- 1 jspw jspw  12K Nov  7 22:26 about.html
-rw-rw-r-- 1 jspw jspw 9.6K Nov  7 22:26 contact.html
drwxrwxr-x 2 jspw jspw 4.0K Nov  7 22:26 css
-rw-rw-r-- 1 jspw jspw   46 Nov  8 00:50 Dockerfile
drwxrwxr-x 4 jspw jspw 4.0K Nov  7 22:26 fontawesome
drwxrwxr-x 2 jspw jspw 4.0K Nov  7 22:26 img
-rw-rw-r-- 1 jspw jspw  15K Nov  7 22:26 index.html
drwxrwxr-x 2 jspw jspw 4.0K Nov  7 22:26 js
-rw-rw-r-- 1 jspw jspw  13K Nov  7 22:26 post.html
drwxrwxr-x 2 jspw jspw 4.0K Nov  7 22:26 video
```

- Build image : `docker build --tag name:version_tag location_of_docker_file`

  Example : `docker build --tag website:latest .`

  Here `.` refers to the current directory

  ```
  (base)  jspw@brainFuck  ~/Documents/Projects/DevOps-Journey/docker/example/share_data_between_host_container/static_website   main ±  docker build --tag website:latest .
  Sending build context to Docker daemon  8.982MB
  Step 1/2 : FROM nginx:latest
  ---> 87a94228f133
  Step 2/2 : ADD . /usr/share/nginx/html
  ---> c7c9f6b1e6d8
  Successfully built c7c9f6b1e6d8

  ```

- run the build image : `docker run --name website -p 8000:80 website:latest`
