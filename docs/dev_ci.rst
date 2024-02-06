.. _dev_ci:

======================
Continuous Integration
======================

.. admonition:: Developer or User?

    This section is part of the instrutions for programmers interested in REEV.
    If you want to **use** REEV, the best place is to start at :ref:`doc_quickstart`.

We make extensive use of GitHub actions for continuous integration:

- ``automerge.yml`` will automatically accept merge requests from dependabot if when CI passes
- ``conventional-prs.yml`` will enforce that all PRs have a title that follows the `conventional commit <https://www.conventionalcommits.org/en/v1.0.0/>`_ format
- ``docker-build.yml`` will automatically build Docker images for the ``main`` branch and all PRs
- ``docker-cleanup-pr.yml`` cleans up PR Docker images after they are merged
- ``docker-cleanup-untagged.yml`` cleans up untagged Docker images
- ``main.yml`` runs lintings and testing for the frontend and backend code and uploads coverage info to Coverage.io
- ``release-please.yml`` will automatically manage release PRs and releases

--------------------
Conventional Commits
--------------------

We follow `conventional commits <https://www.conventionalcommits.org/>`__ and enforce merge requests.
We use `release-please <https://github.com/googleapis/release-please>`__ for managing our releases and changelog.
For best practice this comes down to the following.

1. Open a proper issue for your change and document it as a "bug fix" or "enhancement".
   Alternatively, you can also create an *ad-hoc* commit but it is better to document the motivation, desired action, and actual implementation of the change.
2. Create a branch with a name that corresponds to the desired change/issue.
   GitHub has `documentation for how to do this from an issue <https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-a-branch-for-an-issue>`__.
3. Create appropriate pull request form the branch.
   The first issue should probably follow the conventional commits format (for examples, see below).
   This project has been setup that branches can only be merged with squash pull requests.
   In the case of only one commit in a PR, the first line of the only commit will be used (for technical reasons).
   Otherwise, it would be sufficient for the PR to have a semantic commit message.
4. Get the PR reviewed.
5. Merge the PR.

Examples for commmit messages:

::

    chore: a minor change that does not get an entry in the changelog
    fix: a fix that will enforce bumping the patch component of the version
    feat: a feature that will enforce bumping the minor component of the version
    fix!: a fix with backwards change that will enforce bumping the major component
    feat!: similar as for fix! but for features
    ci: changes to the CI that does not appear in the changelog
    build: changes to the build system that does not appear in the changelog
    docs: changes to the documentation that does not appear in the changelog

You can use a ``Release-As:`` footer to enforce things being upgraded or downgraded in the changelog.
