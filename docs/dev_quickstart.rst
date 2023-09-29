.. _dev_quickstart:

==============
Dev Quickstart
==============

You will need to have Python 3.10, pipenv, and Node.js 20.x installed.
The next step is to checkout the repository and install the Python/Node dependencies.
Then, you will be able to run the frontend and backend servers.
The following assumes a Debian/Ubuntu machine; your mileage may vary.

-------------
Prerequisites
-------------

You can use `pyenv <https://github.com/pyenv/pyenv>`__` for getting a specific python version.

.. code-block:: bash

    $ sudo apt-get update; sudo apt-get install make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
    $ curl https://pyenv.run | bash

Append the following to your ```~/.bashrc``:

.. code-block:: bash

    $ pyenv
    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init --path)"
    eval "$(pyenv virtualenv-init -)"


... and ensure to execute/source this as well (``exec $SHELL``).

Now you can install a specific python version:

.. code-block:: bash

    $ pyenv install 3.10
    $ pyenv local 3.10

Install pipenv:

.. code-block:: bash

    $ pip install --user pipenv

Install NodeJS v20 (LTS):

.. code-block:: bash

    $ curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    $ sudo apt-get install -y nodejs

--------------------
Install Dependencies
--------------------

You can use the provided ``Makefile`` files to install the dependencies.

.. code-block:: bash

    $ make deps

-----------------
Setup Environment
-----------------

You need to create an ``.env`` file for the backend.
The values in ``env-dev`` are suitable for development with the ``reev-docker-compose`` with ``docker-compose.override.yml-dev``.

.. code-block:: bash

    $ ln -sr backend/env-dev backend/.env

-------------------
Database Migrations
-------------------

Next, you will need to run the database migrations.

.. code-block:: bash

    $ make -C backend alembic-upgrade

-------------------
Running the Servers
-------------------

For development, you have to run a server both for the frontend and the backend.
In deployment, the frontent will be built to a static ``dist`` directory and served through the backend HTTP server.

Execute the following two commands in separate terminals.
The servers will be started with automated code reload.
In case of weird issues, try to stop them with ``Ctrl-C`` and starting them again.

.. code-block:: bash

    $ make -C backend serve
    $ make -C frontend serve

Now you can navigate to the frontend development server at http://localhost:8081.
This server will transparently forward the API requests to the backend server at http://localhost:8081.

-----
Notes
-----

- A superuser will be created if you configured its email and password in environment variables ``FIRST_USER_EMAIL`` and ``FIRST_USER_PASSWORD``.
