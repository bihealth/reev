.. _dev_deployment:

==========
Deployment
==========

We deploy with Docker images.
These are built automatically via GitHub CI and publisheed to the GitHub Container Registry (``ghcr.io``).

To build the images locally, run:

.. code-block:: bash

    $ bash utils/docker/build-docker.sh

If you look at the ``build-docker.sh`` file then you will notice that you can pass additional parameters.
A useful one is ``--no-cache`` that will disable the Docker build cache.

.. code-block:: bash

    $ bash utils/docker/build-docker.sh --no-cache

You can run the Docker image on port 8080 as follows (make sure that you replace ``0.0.0`` with the version built previously):

.. code-block:: bash

    $ docker run --name reev --rm -p 8080:8080 ghcr.io/bihealth/reev:0.0.0

To attach to the container and look around:

.. code-block:: bash

    $ docker run -it reev bash -i
