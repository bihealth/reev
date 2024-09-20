.. _ops_deploy:

-----------------------
Deployment Instructions
-----------------------

This section describes the deployment of REEV, both for development and production.

.. _ops_deploy_prerequisites:

Prerequisites
=============

You will need to fetch some of this from our S3 server.
We recommend the ``s5cmd`` tool as it is easy to install, use, and fast.
You can download it from `github.com/peak/s5cmd/releases <https://github.com/peak/s5cmd/releases>`__.
For example:

.. code:: bash

   wget -O /tmp/s5cmd_2.1.0_Linux-64bit.tar.gz \
       https://github.com/peak/s5cmd/releases/download/v2.1.0/s5cmd_2.1.0_Linux-64bit.tar.gz
   tar -C /tmp -xf /tmp/s5cmd_2.1.0_Linux-64bit.tar.gz
   sudo cp /tmp/s5cmd /usr/local/bin/

You will need to install Docker Compose.
Note that the "modern" way is to do this by using the docker compose plugin.
Instructions can be found `here on the Docker.com website <https://docs.docker.com/compose/install/linux/#install-using-the-repository>`__.

.. _ops_deploy_checkout_configure:

Checkout and Configure
======================


First, clone the repository:

.. code:: bash

   git clone git@github.com:bihealth/reev-docker-compose.git

From here on, the commands should be executed from within this repository (``cd reev-docker-compose``).

We will use the directory ``.dev`` within the checkout for storing data and secrets.
In a production deployment, these directories should live outside of the checkout, of course.

Now, we create the directories for data storage.

.. code:: bash

   mkdir -p .dev/volumes/pgadmin/data
   mkdir -p .dev/volumes/postgres/data
   mkdir -p .dev/volumes/rabbitmq/data
   mkdir -p .dev/volumes/redis/data
   mkdir -p .dev/volumes/reev-static/data
   mkdir -p .dev/volumes/seqrepo/local
   mkdir -p .dev/volumes/seqrepo/master

Next, we have to configure the seqrepo volumes. Now let's setup the seqrepo:
Ensure these directories exist on your host and are populated with the necessary data:

.. code-block:: bash

    mkdir -p /usr/local/share/seqrepo
    chown -R root:root /usr/local/share/seqrepo

.. code-block:: bash

    pipenv run seqrepo init -i auto-acmg

.. code-block:: bash

    pipenv run seqrepo fetch-load -i auto-acmg -n RefSeq NC_000001.10 NC_000002.11 NC_000003.11 \
        NC_000004.11 NC_000005.9 NC_000006.11 NC_000007.13 NC_000008.10 NC_000009.11 NC_000010.10 \
        NC_000011.9 NC_000012.11 NC_000013.10 NC_000014.8 NC_000015.9 NC_000016.9 NC_000017.10 \
        NC_000018.9 NC_000019.9 NC_000020.10 NC_000021.8 NC_000022.10 NC_000023.10 NC_000024.9 \
        NC_012920.1 NC_000001.11 NC_000002.12 NC_000003.12 NC_000004.12 NC_000005.10 NC_000006.12 \
        NC_000007.14 NC_000008.11 NC_000009.12 NC_000010.11 NC_000011.10 NC_000012.12 NC_000013.11 \
        NC_000014.9 NC_000015.10 NC_000016.10 NC_000017.11 NC_000018.10 NC_000019.10 NC_000020.11 \
        NC_000021.9 NC_000022.11 NC_000023.11 NC_000024.10 NC_012920.1

After successful execution, you should have the "general" seqrepo directory at
``/usr/local/share/seqrepo`` or similar directory. Also you should see the auto-acmg related seqrepo
directory at ``/home/username/.seqrepo/auto-acmg``, where ``username`` is your username. Note, that
this path may vary! Now make local copies of both directories to the seqrepo volumes:

.. code-block:: bash

    cp -r /usr/local/share/seqrepo .dev/volumes/seqrepo/local
    cp -r /home/username/.seqrepo/auto-acmg .dev/volumes/seqrepo/master

If the above doesn't work for you, you can try to download backups from the CUBI SharePoint. The
backups are located in the folder ``/Documents/Coding and Engineering/AutoACMG``. Then unarchive
them with the following command:

.. code-block:: bash

    tar -czvf seqrepo_local.tar.gz .dev/volumes/seqrepo/local --strip-components=1
    tar -czvf seqrepo_master.tar.gz .dev/volumes/seqrepo/master --strip-components=1

Finally, you should have the following directories structures:

.. code-block:: bash

    seqrepo
    ├── master
    │   ├── aliases.sqlite3
    │   ├── sequences
    │          └── db.sqlite3
    │          └── 2024
    │                └── 1224
    │                └── ....

    └── local
        ├── master
            ├── aliases.sqlite3
            ├── sequences
                └── db.sqlite3


Next, we setup some "secrets" for the passwords.

.. code:: bash

   mkdir -p .dev/secrets
   echo db-password >.dev/secrets/db-password
   echo pgadmin-password >.dev/secrets/pgadmin-password

We now copy the ``env.tpl`` file to the default location for the environment ``.env``.

.. code:: bash

   cp env.tpl .env

Next, create a ``docker-compose.override.yml`` with the contents of the file ``docker-compose.override.yml-dev``.
This will disable everything that we assume is running on your host when you are developing.
This includes the REEV backend, rabbitmq, celery workers, postgres.

.. code:: bash

   cp docker-compose.override.yml-dev docker-compose.override.yml

.. _ops_deploy_download_data:

Download Data
=============

To serve data via the mehari, viguno, and annonars containers, you need to obtain the required datasets.
We have prepared significantly reduced datasets (totaling less than 2GB as opposed to hundreds of GB) for development purposes.

We provide a script that sets up the necessary directories, downloads the data, and creates symlinks.

By default, the script verifies SSL certificates when downloading data.
If you encounter SSL verification issues or operate in an environment where SSL verification is not required, you can disable SSL verification by setting the ``NO_VERIFY_SSL`` variable to ``1`` when running the script.

To download the data with SSL verification (default behavior):

.. code:: bash

   bash download-data.sh

.. note::

    Note that you can also download the full data by using ``DOWNLOAD=full bash download-data.sh`` below.
    To use a reduced dataset to exons plus/minus 100bp, use ``DOWNLOAD=reduced-exomes bash download-data.sh``.

To download the data without SSL verification:

.. code:: bash

   NO_VERIFY_SSL=1 bash download-data.sh

Note: Disabling SSL verification can make the connection less secure.
Use this option only if you understand the risks and it is necessary for your environment.

.. _ops_deploy_setup_configuration:

Setup Configuration
===================

The next step step is to create the configuration files in ``.dev/config``.

.. code:: bash

   mkdir -p .dev/config/nginx
   cp utils/nginx/nginx.conf .dev/config/nginx

   mkdir -p .dev/config/pgadmin
   cp utils/pgadmin/servers.json .dev/config/pgadmin

.. _ops_deploy_startup_check:

Startup and Check
=================


Now, you can bring up the docker compose environment (stop with
``Ctrl+C``).

.. code:: bash

   docker compose up

To verify the results, have a look at the following URLs.
These URLs are used by the REEV application.

-  Annonars database infos:
   http://127.0.0.1:3001/annos/db-info?genome_release=grch37
-  Annonars gene info: http://0.0.0.0:3001/genes/info?hgnc_id=HGNC:12403
-  Annonars variant info:
   http://0.0.0.0:3001/annos/variant?genome_release=grch37&chromosome=17&pos=41244100&reference=G&alternative=A
-  Mehari impact prections:
   http://127.0.0.1:3002/tx/csq?genome-release=grch37&chromosome=17&position=48275363&reference=C&alternative=A
-  Viguno for TGDS: http://127.0.0.1:3003/hpo/genes?gene_symbol=TGDS
-  Nginx server with browser tracks http://127.0.0.1:3004/
-  Dotty server with c./n./g. to SPDI resolution
   http://127.0.0.1:3005/api/v1/to-spdi?q=NM_000059.3:c.274G%3EA

Note that the development subset only has variants for a few genes, including BRCA1 (the example above).

You will also have the following services useful for introspection during development.
For production, you probably don't want to expose them publically.

-  `flower <https://flower.readthedocs.io/en/latest/>`__, login is ``admin``, with password ``flower-password``
-  `pgAdmin <https://www.pgadmin.org/>`__ for Postgres DB administration: http://127.0.0.1:3041 login is ``admin@example.com`` with password ``pgadmin-password``

.. _ops_deploy_service_information:

Service Information
===================

This section describes the services that are started with this Docker Compose.

Traefik
-------

`Traefik <https://traefik.io/traefik/>`__ is a reverse proxy that is used as the main entry point for all services behind HTTP(S).
The software is well-documented by its creators.
However, it is central to the setup and for much of the additional setup, touching Trafik configuration is needed.
We thus summarize some important points here.

-  Almost all configuration is done using labels on the ``traefik`` container itself or other containers.
-  In the case of using configuration files, you will have to mount them from the host into the container.
-  By default, we use "catch-all" configuration based on regular expressions on the host/domain name.

Dotty
-----

Dotty (by the REEV authors) provides mapping from c./n./g. notation to SPDI.

Mehari
------

Mehari (by the REEV authors) provides information about variants and their effect on individual transcripts.

Viguno
------

Viguno (by the REEV authors) provides HPO/OMIM related information.

Annonars
--------

Annonars (by the REEV authors) provides variant annotation from public
databases.

Postgres
--------

We use postgres for the database backend of REEV.

Rabbitmq
--------

We use rabbitmq for message queues.

Redis
-----

REDIS is used for storing authentication sessions.

PgAdmin
-------

PgAdmin is a web-based administration tool for Postgres.
We provide it for development and debugging but it can also come in handy in production.

Flower
------

Flower is a web-based application for monitoring and administrating Celery.
