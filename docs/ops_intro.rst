.. _ops_intro:

---------------------
Operator Introduction
---------------------

This section gives you an overview of REEV operation.
Overall, a REEV installation consists of a number of Docker containers with access to static data.

We currently run the containers using Docker Compose.
Data is hosted on our S3 servers.
Read the section :ref:`ops_deploy` for information on getting both software and data.

You can find the source code of everything in the following repositories:

REEV Web Application
    https://github.com/bihealth/reev

REEV Frontend Library with shared code
    https://github.com/bihealth/reev-frontend-lib

REEV Docker Compose
    https://github.com/bihealth/reev-docker-compose

Data Downloader
    https://github.com/varfish-org/varfish-db-downloader

    This Snakemake workflow downloads and processes the data.
    You do not need to do this but can use the data provided on our S3 servers.
    See :ref:`ops_deploy` for more details.
