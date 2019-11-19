# Sudomanse Server
This is the main sudomanse server. All other parts of the sudomanse applications require this server to be up and running to work.  

# Contents
* [Demo](#Demo)  
* [Introduction](#Introduction)  
* [Requirements](#Requirements)  
* [Installation](#Installation)  
  * [Setup](#Setup)
    * [Clone / Download](#Clone--Download) 
    * [Install npm packages](#Install-all-npm-packages) 
    * [Configuration](#Configuration)
  * [Local (development)](#Local-Development)
    * [Compile Typescript](#Compile-Typescript-project)
    * [Run project](#Run-compiled-project)
  * [Docker (production)](#Docker-Production)
    * [Build docker image](#Build-docker-image)
    * [Run docker image](#Run-docker-image)
  * [NGINX (deploy)](#NGINX-deploy)
    * [Setup config](#Setup-config)
    * [Enable config](#Enable-config)
 * [Testing](#Testing)
   * [State](#State)
   * [Sadly no standalone](#Sadly-no-standalone)
   * [Running tests](#Running-tests)
 * [Finishing notes](#Finishing-notes)
   * [Not how to](#Not-how-to)

# Demo
View the demo at [sudomanse.vens.xyz](https://sudomanse.vens.xyz)  
> **NOTE**  
> Even in its current **incomplete** state I will still be hosting this server.  
> It will constantly change as I push out new updates, things will break.  

# Introduction
Sudomanse server is an application used for automation and monitoring of self managed stations.  
To interface with the system an [http API](docs/HTTPAPI.md) is used.

`Users` will be allowed to access the system.  
There are `Stations` on the system.  
The `Stations` each have their own `Input`s and `Output`s.  
`Input`s take real world information and send it into the system.  
`Output`s allows the system to control real world things.

There are additional resources included in here to help with setting up a development environment, delpoying to [Docker](https://www.docker.com/) and configuring your [NGINX](https://www.nginx.com/) to serve this project.  

# Requirements
* Node `v10.16.0` (this is the only version I have tried)
* Docker installed (OPTIONAL: only required for the docker step)

# Installation  
## Setup

### Clone / Download  
This project can be cloned or downloaded from [this](https://github.com/sudomanse/server.git) `github` repository
```
$ git clone https://github.com/sudomanse/server.git
```  

### Install all npm packages  
```
$ npm install
```

### Configuration
There are 3 files provided to show what kinds of configuration changes can be made.  
1. `tsconfig.json`  
Used for TypeScript -> JavaScript compiler options
2. `example.env` -> `.env`  
Used to define `ENV` vars
    > **NOTE**  
    This file is only used during development.  
    `dotenv` will load all the `ENV` vars from `.env` when you run in development 
    mode, but during production, you will set the `ENV` variables by sending them in with `docker build ...`
3. `example.ormconfig.json` -> `ormconfig.json`  
Used to define the [TypeOrm](https://github.com/typeorm/typeorm) database  
    > **NOTE**  
    The default database is a basic `sqlite` database, but can be changed to anything that `typeorm` supports.


## Local (development)
Once the project is installed it is ready to run.  
`npm` scripts have been set up to help. 

### Compile Typescript project
To turn the `.ts` files in the `src/` folder into `.js` files ready for use, compile with:  
```
$ npm run build
```  
> **NOTE**  
> The default directory for compiled files is in `dist/`. This can be changed by editing the `tsconfig.json` file.

### Run compiled project
To run the complied project from the `dist/` folder:  
```
$ npm run start-dev
```  
> **TIP**  
>There is a quick way to run both compilation and execution in one step:  
>```
>$ npm run all-dev
>```

The server is now running, and is ready for any interactions via the http API.

## Docker (production)
How to host the application in a docker container.  
> **NOTE**  
> This is not a required step
### Build docker image
```
$ docker build \
  --build-arg server_debug=0 \
  --build-arg server_port=3009 \
  --build-arg bodyparser_json_limit=1kb \
  --build-arg bcrypt_salt_rounds=10 \
  --build-arg jwt_public_key_location="/home/sudomansevensxyz/app/keys/public.key" \
  --build-arg jwt_private_key_location="/home/sudomansevensxyz/app/keys/private.key" \
  --build-arg mqtt_connection_string=mqtt://192.168.1.110:1883 \
  --build-arg mqtt_topic_input=input \
  --build-arg mqtt_topic_output=output \
  -t sudomanseserver .
```
> **NOTE**  
> Be sure that the user you are running this project as is part of the `docker` group.  
> To add current user to the `docker` group:  
>```
>$ sudo gpasswd -a docker $USER
>```
> For this to take affect be sure to logout and back in again.

### Run docker image
```
$ docker run --name=sudomanseserver --restart=always -p=3009:3009 -t sudomanseserver
```
> **NOTE**  
> A port is mapped like: `-p=[EXTERNAL]:[INTERNAL]`  
> The node app will startup saying `Listening on :3009` but that `:3009` is only the `[INTERNAL]` port. To access the service you have to hit the `[EXTERNAL]` port.

## NGINX (deploy)
How to setup the project to work with NGINX.

### Setup config
A very basic config files has been provided: `sudomanseserver`  
Copy the `sudomanseserver` file into your `/etc/nginx/sites-available`  
```
$ cp sudomanseserver /etc/nginx/sites-available/sudomanseserver
```

> **NOTE**  
> In this basic config, I am using the domain `sudomanse.vens.xyz`, you can change it out with any domain you own.  
### Enable config
Link your `sites-available` config file into the `sites-enabled` folder. 
```
$ ln -s /etc/nginx/sites-available/sudomanseserver /etc/nginx/sites-enabled/sudomanseserver
```

> **NOTE**  
> For changes to work, you have to restart NGINX  
> ```
> $ service nginx restart
> ```

# Testing
Testing has been removed for the most recent version of SudoManse  
Tests are being completely changed, and will enter SudoManse in v0.1.3
## State

The tests will create my current setup, but you can edit them as you please.  
> **TIP**  
> Learn more about [my current setup](docs/MyCurrentSetup.md)

# Finishing notes
This guide is not complete. There are many parts still to come.  

## Not how to
This guide will **NOT** show you how to:  
  * change your domain name to point to the IP address you run this application server from  
  * route network traffic to this application
  * setup `https` for your application