### Environmental variables
When using the BitBucket pipelines, the following should be used:
* App (set per environment)
    * `PORT` The port on which the docker container will listen
    * `API_URL` The base URL that the app will be using for all the API calls
* Docker
    * `DOCKER_ACCOUNT` The account from which to fetch the image
    * `DOCKER_PASSWORD` The password used to authenticate to the Docker repository
    * `DOCKER_PASSWORD` The name of the Docker image to use
* Server login
    * `SERVER_HOST`
    * `SERVER_PORT`
    * `SERVER_USER`

Check here on how to set up and use [BitBucket variables](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/).

In BitBucket, go to `Repository Settings` -> `Repository variables` to manage the variables.

### Servers side requirements
The server must be on a Linux OS, with the addition of the following software:
1. SSH server
2. Docker
3. nginx
4. certbot (optional)

#### SSH
Deployment itself is done via SSH, by using [key-based authentication](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server).
Make sure the public key of the deployment user has been included in `~/.ssh/authorized_keys`

In BitBucket, go to `Repository Settings` -> `SSH keys` to define the keys to use.

#### Docker
Make sure the SSH user used for deployment has the required [privileges](https://docs.docker.com/engine/security/rootless/).

#### nginx
The nginx server will serve only as a reversed-proxy, that will redirect a (sub)domain to a port of one of the Docker containers.

The following example will redirect everything from `b2b.staging.croonus.com` to port `8081`:
```shell
server {
    listen      80 default;
    server_name b2b.staging.croonus.com;
    location / {
        proxy_set_header X-Real-IP        $remote_addr;
        proxy_set_header X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header Host             $host;

        proxy_pass http://127.0.0.1:6002/;
    }
}
```

#### certbot
Optionally used to automatically fetch new certificates from [letsencrypt.com](letsencrypt.com).
More information on how to use `certbot` application can be found [here](https://certbot.eff.org/instructions?ws=nginx&os=leap).
