.. _dev_tf:

=========================
GitHub Project Management
=========================

.. admonition:: Developer or User?

    This section is part of the instrutions for programmers interested in REEV.
    If you want to **use** REEV, the best place is to start at :ref:`doc_quickstart`.

We use Terraform for managing the GitHub project settings (as applicable):

.. code-block:: bash

    $ export GITHUB_OWNER=bihealth
    $ export GITHUB_TOKEN=ghp_<thetoken>

    $ cd utils/terraform
    $ terraform init
    $ terraform import github_repository.reev reev
    $ terraform validate
    $ terraform fmt
    $ terraform plan
    $ terraform apply
